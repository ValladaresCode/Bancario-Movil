import { useCallback, useEffect, useState } from 'react'
import {
  approveSignupRequestWithAuthService,
  rejectSignupRequestWithAuthService,
  getSignupRequestsWithAuthService,
} from '../../../shared/api/auth.js'
import { useAuthStore } from '../../auth/store/authStore.js'

export const useSignupRequests = () => {
  const { session } = useAuthStore()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionId, setActionId] = useState('')
  // Token de verificación de la última solicitud aprobada, para copiarlo y
  // pegarlo directo en la app móvil (evita depender del correo en pruebas).
  const [approvedToken, setApprovedToken] = useState(null)

  const loadRequests = useCallback(async () => {
    if (!session?.token) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError('')
      const response = await getSignupRequestsWithAuthService(session.token)
      setRequests(Array.isArray(response?.data) ? response.data : [])
    } catch (err) {
      setError(err.message || 'No fue posible cargar las solicitudes')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-en-montaje; loadRequests es estable (useCallback)
    loadRequests()
  }, [loadRequests])

  const handleRequestAction = useCallback(
    async (requestId, action) => {
      try {
        setActionId(requestId)
        setActionError('')
        if (action === 'approve') {
          const response = await approveSignupRequestWithAuthService(session?.token, requestId)
          const token = response?.data?.verificationToken
          if (token) {
            const target = requests.find((item) => item.Id === requestId)
            setApprovedToken({ email: target?.Email || '', token })
          }
        } else if (action === 'reject') {
          await rejectSignupRequestWithAuthService(session?.token, requestId)
        }
        setRequests((current) => current.filter((item) => item.Id !== requestId))
      } catch (err) {
        setActionError(err.message || 'No fue posible procesar la solicitud')
      } finally {
        setActionId('')
      }
    },
    [session, requests]
  )

  const clearApprovedToken = useCallback(() => setApprovedToken(null), [])

  return {
    requests,
    loading,
    error,
    actionError,
    actionId,
    handleRequestAction,
    refreshRequests: loadRequests,
    approvedToken,
    clearApprovedToken,
  }
}
