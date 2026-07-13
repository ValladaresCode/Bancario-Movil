import { axiosAuth } from './api.js'

// Toda la comunicacion con el AuthService pasa por axiosAuth:
// - withCredentials envia/recibe la cookie HttpOnly del refresh token.
// - el interceptor de request inyecta el access token (Bearer + x-token).
// - el interceptor de response refresca en 401 y reintenta.

export async function loginWithAuthService({ email, password }) {
  const { data } = await axiosAuth.post('/auth/login', { email, password })
  return data
}

export async function registerWithAuthService(formData) {
  // Se enruta el registro como solicitud de alta (signup request).
  const { data } = await axiosAuth.post('/auth/signup-request', formData)
  return data
}

export async function submitSignupRequestWithAuthService(form) {
  // Convertir a FormData: la ruta usa multer (multipart) y un objeto plano
  // se serializaría como JSON, perdiendo el archivo de la foto de perfil.
  const payload = form instanceof FormData ? form : new FormData()
  if (!(form instanceof FormData)) {
    for (const [key, value] of Object.entries(form)) {
      if (value === null || value === undefined || value === '') continue
      payload.append(key, value)
    }
  }
  const { data } = await axiosAuth.post('/auth/signup-request', payload)
  return data
}

export async function getSignupRequestsWithAuthService() {
  const { data } = await axiosAuth.get('/auth/signup-requests')
  return data
}

export async function checkSignupRequestStatus(email) {
  const { data } = await axiosAuth.get(
    `/auth/signup-requests/status/${encodeURIComponent(email)}`
  )
  return data
}

export async function approveSignupRequestWithAuthService(_token, requestId) {
  const { data } = await axiosAuth.post(`/auth/signup-requests/${requestId}/approve`)
  return data
}

export async function rejectSignupRequestWithAuthService(_token, requestId) {
  const { data } = await axiosAuth.post(`/auth/signup-requests/${requestId}/reject`)
  return data
}

export async function verifyEmailWithAuthService(token) {
  const { data } = await axiosAuth.post('/auth/verify-email', { token })
  return data
}

export async function verifyEmailLinkWithAuthService(token) {
  const { data } = await axiosAuth.get('/auth/verify-email', { params: { token } })
  return data
}

export async function resendVerificationWithAuthService(email) {
  const { data } = await axiosAuth.post('/auth/resend-verification', { email })
  return data
}

export async function forgotPasswordWithAuthService(email) {
  const { data } = await axiosAuth.post('/auth/forgot-password', { email })
  return data
}

export async function resetPasswordWithAuthService(token, newPassword) {
  const { data } = await axiosAuth.post('/auth/reset-password', { token, newPassword })
  return data
}

export async function logoutWithAuthService() {
  const { data } = await axiosAuth.post('/auth/logout')
  return data
}

export async function getProfileWithAuthService() {
  const { data } = await axiosAuth.get('/auth/profile')
  return data
}

export async function getProfileByIdWithAuthService(_token, userId) {
  const { data } = await axiosAuth.post('/auth/profile/by-id', { userId })
  return data
}

export async function updateProfileWithAuthService(_token, formData) {
  const { data } = await axiosAuth.patch('/users/me', formData)
  return data
}

export async function getUpdateRequestsWithAuthService(_token, status) {
  const { data } = await axiosAuth.get('/users/update-requests', {
    params: status ? { status } : undefined,
  })
  return data
}

export async function approveUpdateRequestWithAuthService(_token, requestId) {
  const { data } = await axiosAuth.post(`/users/update-requests/${requestId}/approve`)
  return data
}

export async function rejectUpdateRequestWithAuthService(_token, requestId) {
  const { data } = await axiosAuth.post(`/users/update-requests/${requestId}/reject`)
  return data
}

export async function getAllUsersWithAuthService() {
  const { data } = await axiosAuth.get('/users/all')
  return data
}
