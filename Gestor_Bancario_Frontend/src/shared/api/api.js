import axios from "axios";
import { loadSession, saveSession, clearSession } from "../utils/session-storage.js";

const stripTrailingSlash = (value = '') => value.replace(/\/+$/, '')

const getAuthToken = () => {
  const session = loadSession()
  return session?.token || null
}

export const API_CONFIG = {
  authBaseUrl: stripTrailingSlash(
    import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000/api/v1'
  ),
  bankBaseUrl: stripTrailingSlash(
    import.meta.env.VITE_BANK_API_URL || 'http://localhost:3006/gestionBancaria/api/v1'
  ),
  bankHealthUrl: stripTrailingSlash(
    import.meta.env.VITE_BANK_HEALTH_URL || 'http://localhost:3006/health'
  ),
}

// Cliente del AuthService (:4000). withCredentials -> envia/recibe la cookie
// HttpOnly del refresh token. La cookie SOLO existe para este origen.
export const axiosAuth = axios.create({
  baseURL: API_CONFIG.authBaseUrl,
  timeout: 8000,
  withCredentials: true,
})

// Clientes del backend bancario (:3006). SIN withCredentials: el banco no usa
// cookies y activarlo romperia si respondiera Access-Control-Allow-Origin: *.
export const axiosAccount = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_URL || API_CONFIG.bankBaseUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const axiosTransaction = axios.create({
  baseURL: import.meta.env.VITE_TRANSACTION_URL || API_CONFIG.bankBaseUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Instancia generica (URLs absolutas) para los wrappers requestJson/requestFormData.
// Da cobertura del interceptor de refresh a las llamadas que antes usaban fetch.
export const axiosRaw = axios.create({ timeout: 8000 })

// --- Request interceptor: inyecta el access token en ambos headers ---
const attachToken = (config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-token'] = token
  }
  return config
}

// ---------------------------------------------------------------------------
// Single-flight refresh (obs. 2): una sola promesa de /auth/refresh para todas
// las peticiones que fallen con 401 en paralelo. Evita reenviar el refresh
// token viejo dos veces (falso positivo de reuso -> revocacion de la sesion).
// ---------------------------------------------------------------------------
let refreshPromise = null

export function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axiosAuth
      // withCredentials manda la cookie HttpOnly; _skipAuthRefresh evita recursion.
      .post('/auth/refresh', {}, { withCredentials: true, _skipAuthRefresh: true })
      .then((res) => {
        const token = res.data.token
        saveSession({ ...loadSession(), token }) // persiste el nuevo access token
        return token
      })
      .catch((err) => {
        clearSession()
        if (typeof window !== 'undefined') window.location.href = '/login'
        return Promise.reject(err)
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

// Rutas de auth donde un 401 NO debe disparar refresh (son el flujo mismo).
const NO_REFRESH = ['/auth/login', '/auth/refresh', '/auth/logout']

// --- Response interceptor: 401 -> refresh silencioso -> reintento transparente ---
const makeResponseErrorHandler = (instance) => async (error) => {
  const original = error.config
  const status = error.response?.status
  const url = String(original?.url || '')
  const skip =
    !original ||
    original._retry ||
    original._skipAuthRefresh ||
    NO_REFRESH.some((p) => url.includes(p))

  // Solo intentamos refrescar si habia una sesion previa (token presente).
  if (status === 401 && !skip && getAuthToken()) {
    original._retry = true
    const token = await refreshAccessToken()
    original.headers = original.headers || {}
    original.headers.Authorization = `Bearer ${token}`
    original.headers['x-token'] = token
    return instance(original)
  }

  // Normaliza el error para que las features lo lean igual que antes:
  // .payload (con errors[] de validacion), .status y un .message legible.
  if (error.response) {
    error.payload = error.response.data
    error.status = error.response.status
    const backendMessage = error.response.data?.message || error.response.data?.error
    if (backendMessage) error.message = backendMessage
  }

  return Promise.reject(error)
}

for (const instance of [axiosAuth, axiosAccount, axiosTransaction, axiosRaw]) {
  instance.interceptors.request.use(attachToken)
  instance.interceptors.response.use((response) => response, makeResponseErrorHandler(instance))
}

export class ApiError extends Error {
	constructor(message, status, payload) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.payload = payload
	}
}

// requestJson / requestFormData: mantienen su firma pero ahora corren sobre Axios
// (axiosRaw) para heredar el interceptor de refresh en 401. Preservan el contrato
// de error (ApiError con status/payload) que consumen las features.
export async function requestJson(url, options = {}) {
	const { body, headers, method = 'GET' } = options

	try {
		const response = await axiosRaw({
			url,
			method,
			data: body,
			headers: { Accept: 'application/json', ...headers },
		})
		return response.data ?? null
	} catch (error) {
		if (error.response) {
			const payload = error.response.data
			const message = payload?.message || payload?.error || 'Request failed'
			throw new ApiError(message, error.response.status, payload)
		}
		throw new ApiError(error.message || 'Error de red', 0, null)
	}
}

export async function requestFormData(url, options = {}) {
	const { body, headers, method = 'POST' } = options

	const formData = body instanceof FormData ? body : new FormData()

	if (!(body instanceof FormData) && body && typeof body === 'object') {
		for (const [key, value] of Object.entries(body)) {
			if (value !== undefined && value !== null) {
				formData.append(key, value)
			}
		}
	}

	try {
		// No fijamos Content-Type: Axios pone el boundary del multipart automaticamente.
		const response = await axiosRaw({
			url,
			method,
			data: formData,
			headers: { Accept: 'application/json', ...headers },
		})
		return response.data ?? null
	} catch (error) {
		if (error.response) {
			const payload = error.response.data
			const message = payload?.message || payload?.error || 'Request failed'
			throw new ApiError(message, error.response.status, payload)
		}
		throw new ApiError(error.message || 'Error de red', 0, null)
	}
}

export { axiosAccount as default }
