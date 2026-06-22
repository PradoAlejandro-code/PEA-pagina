import { useState, type ReactNode } from 'react'
import { Eye, EyeOff, LogIn, ShieldCheck, Users } from 'lucide-react'
import { useAuth, useAdminLogin, usePadronLogin, type AuthScope } from '../hooks/auth'
import type { AuthRole } from '../features/api/auth'

interface LoginGuardProps {
  scope: AuthScope
  /** Si se especifica, sólo ese rol puede pasar. Si no, cualquier rol autenticado. */
  requiredRole?: AuthRole
  children: ReactNode
}

const SCOPE_LABELS: Record<AuthScope, { title: string; subtitle: string; icon: typeof ShieldCheck }> = {
  admin: {
    title: 'Panel Administrativo',
    subtitle: 'Acceso restringido al equipo PEA',
    icon: ShieldCheck,
  },
  padron: {
    title: 'Padrón Electoral',
    subtitle: 'Acceso para fiscales y votantes habilitados',
    icon: Users,
  },
}

export default function LoginGuard({ scope, requiredRole, children }: LoginGuardProps) {
  const { isAuthenticated, role, setAuthenticated } = useAuth(scope)

  const adminMutation = useAdminLogin()
  const padronMutation = usePadronLogin()

  const mutation = scope === 'admin' ? adminMutation : padronMutation

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  // Si está autenticado y el rol es correcto → mostrar contenido
  const hasAccess = isAuthenticated && (!requiredRole || role === requiredRole)
  if (hasAccess) {
    return <>{children}</>
  }

  const { title, subtitle, icon: Icon } = SCOPE_LABELS[scope]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    mutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          if (requiredRole && data.role !== requiredRole) {
            setLocalError('Tu usuario no tiene permisos para este panel.')
            return
          }
          setAuthenticated(data.role)
        },
        onError: (err: unknown) => {
          const message =
            err instanceof Error
              ? err.message
              : 'Credenciales inválidas. Verificá usuario y contraseña.'
          setLocalError(message)
        },
      },
    )
  }

  const error = localError || (mutation.isError ? 'Credenciales inválidas. Verificá usuario y contraseña.' : null)

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1a2e42] relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#2b7fff]/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#325579]/30 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="w-full max-w-md px-4 py-8 flex flex-col items-center gap-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/logo_pea.webp"
            alt="Logo PEA"
            className="h-24 w-24 rounded-full border-4 border-white/20 shadow-2xl object-cover"
          />
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-sm text-white/60 mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-7 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Icon className="h-5 w-5 text-[#2b7fff]" />
            <span className="text-white font-semibold text-sm">Iniciar sesión</span>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/20 border border-red-400/30 text-red-300 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Usuario */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Usuario
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder="admin"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/50 focus:border-[#2b7fff]/60 transition-all"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/50 focus:border-[#2b7fff]/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={mutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#2b7fff] hover:bg-[#1a6ee6] disabled:bg-[#2b7fff]/40 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed mt-2"
            >
              <LogIn className="h-4 w-4" />
              <span>{mutation.isPending ? 'Verificando...' : 'Ingresar'}</span>
            </button>
          </form>
        </div>

        <p className="text-white/30 text-xs text-center">
          PEA — Programa de Enlace Académico · UNTDF
        </p>
      </div>
    </div>
  )
}
