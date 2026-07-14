import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Home,
  CreditCard,
  ArrowRightLeft,
  Heart,
  Package,
  Tag,
  Sun,
  Moon,
  TrendingUp,
  Menu,
  X
} from 'lucide-react'

import { AvatarUser } from '../ui/AvatarUser'
import { useTheme } from '../../store/themeStore.js'

export const ClientNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const getNavLinkClass = ({ isActive }) => {
    if (isActive) {
      return isDark
        ? 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 bg-white text-black'
        : 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 bg-[#1a56db] text-white'
    }

    return isDark
      ? 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 text-white/70 hover:text-white hover:bg-white/8'
      : 'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
  }

  return (
    <header className="relative z-50 mb-5"
      style={{
        backgroundColor: 'var(--theme-surface)',
        borderRadius: '16px',
        border: '1px solid var(--theme-border)',
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* LOGO */}
        <div className="flex items-center">
          <h1 className="text-xl font-black tracking-widest text-[var(--theme-text)]">
            KINAL BANC
          </h1>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-1">
          <NavLink to="/client" end className={getNavLinkClass}>
            <Home size={16} />
            Inicio
          </NavLink>

          <NavLink to="/client/accounts" className={getNavLinkClass}>
            <CreditCard size={16} />
            Mis cuentas
          </NavLink>

          <NavLink to="/client/transacciones" className={getNavLinkClass}>
            <ArrowRightLeft size={16} />
            Transacciones
          </NavLink>

          <NavLink to="/client/favoritos" className={getNavLinkClass}>
            <Heart size={16} />
            Favoritos
          </NavLink>

          <NavLink to="/client/servicios" className={getNavLinkClass}>
            <Package size={16} />
            Servicios
          </NavLink>

          <NavLink to="/client/promociones" className={getNavLinkClass}>
            <Tag size={16} />
            Promociones
          </NavLink>

          <NavLink to="/client/divisas" className={getNavLinkClass}>
            <TrendingUp size={16} />
            Divisas
          </NavLink>
        </nav>

        {/* USER + HAMBURGER */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={isDark
              ? 'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20'
              : 'inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100'
            }
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <AvatarUser />

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition lg:hidden ${
              isDark
                ? 'border-white/15 bg-white/10 text-white hover:bg-white/20'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      {mobileOpen && (
        <nav className="border-t border-[var(--theme-border)] px-4 py-3 lg:hidden"
          style={{ backgroundColor: 'var(--theme-surface)' }}>
          <div className="flex flex-col gap-1">
            {[
              { to: '/client', label: 'Inicio', icon: Home, end: true },
              { to: '/client/accounts', label: 'Mis cuentas', icon: CreditCard },
              { to: '/client/transacciones', label: 'Transacciones', icon: ArrowRightLeft },
              { to: '/client/favoritos', label: 'Favoritos', icon: Heart },
              { to: '/client/servicios', label: 'Servicios', icon: Package },
              { to: '/client/promociones', label: 'Promociones', icon: Tag },
              { to: '/client/divisas', label: 'Divisas', icon: TrendingUp },
            ].map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-[#1a56db] text-white'
                      : isDark
                        ? 'text-white/70 hover:bg-white/8 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}