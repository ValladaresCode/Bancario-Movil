import { UnifiedAuthForm } from '../../auth/components/UnifiedAuthForm.jsx'

export const CreateUserModal = ({ open, onClose, onRegistered }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[color:var(--theme-surface)] p-4 shadow-lg sm:p-6">
        <button
          type="button"
          onClick={onClose}
          className="sticky top-0 ml-auto rounded-full bg-[color:var(--theme-surface-alt)] px-3 py-1 text-sm text-[color:var(--theme-text)]"
        >
          Cerrar
        </button>
        <UnifiedAuthForm initialMode="register" onlyRegister dynamic onRegistered={onRegistered} />
      </div>
    </div>
  )
}
