// Adapta el DTO plano del AuthService (buildUserResponse: claves camelCase en
// español) a los nombres que usan las vistas admin. Todos los endpoints de
// usuarios devuelven ese único shape; no hay que soportar objetos crudos.
export const resolveUser = (user) => {
  if (!user) return {}

  return {
    id: user.id || '',
    name: user.name || 'Sin nombre',
    email: user.email || 'sin-email',
    phone: user.phone || '',
    role: user.role || 'USER_ROLE',
    isActive: user.isActive ?? false,
    emailVerified: user.isEmailVerified ?? false,
    dpi: user.dpi || 'No registrado',
    address: user.direccion || 'No registrada',
    monthlyIncome: user.ingresosMensuales || 0,
    occupation: user.nombreTrabajo || 'No registrada',
    createdAt: user.createdAt,
  }
}
