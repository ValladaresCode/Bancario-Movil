export const DashboardHeader = ({ title, subtitle, onLogout, userRole }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4 shadow-sm backdrop-blur-xl transition-colors">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--theme-accent)]">
          Gestor Bancario
        </p>
        <h1 className="mt-1 text-lg font-bold text-[var(--theme-text)] truncate">{title}</h1>
        <p className="mt-1 text-sm text-[var(--theme-text-muted)] truncate">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="rounded-full border border-[var(--theme-accent)]/30 bg-[var(--theme-accent)]/10 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--theme-accent)] whitespace-nowrap">
          {userRole}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-[var(--theme-text)] transition hover:opacity-80 whitespace-nowrap"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}