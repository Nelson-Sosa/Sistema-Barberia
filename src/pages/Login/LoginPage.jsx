import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/schemas/authSchemas'
import { ROUTES } from '@/routes/routes'
import { APP_NAME, USER_ROLES } from '@/constants/app'
import { usePageTitle } from '@/hooks/usePageTitle'
import { usePendingAction } from '@/hooks/usePendingAction'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

/**
 * LoginPage — public authentication screen.
 *
 * Features:
 * - Email/password login with Zod validation via React Hook Form
 * - Google sign-in button
 * - Show/hide password toggle
 * - Redirects to intended page after login (using router state.from)
 * - Loading states on both login methods
 */

/** Routes restricted to administrators only — used to avoid sending clients there. */
const ADMIN_ONLY_ROUTES = new Set([
  ROUTES.DASHBOARD,
  ROUTES.CLIENTS,
  ROUTES.SETTINGS,
  ROUTES.REPORTS,
])

function LoginPage() {
  usePageTitle('Iniciar sesión', false)

  const { login, loginWithGoogle, isAuthenticated, loading, role, loadingRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { getPendingAction, clearPendingAction } = usePendingAction()

  // Route the user was trying to reach before hitting /login (if any)
  const from = location.state?.from?.pathname

  // Resolve where to go after login. Never land on the previous user's panel:
  // a client must not reach admin-only routes, and an admin must not land on
  // the client home (/my-dashboard) left over from the previous session.
  const resolveDestination = () => {
    const pendingAction = getPendingAction()
    if (pendingAction && pendingAction.type === 'BOOK_SERVICE') {
      clearPendingAction()
      return {
        path: ROUTES.APPOINTMENTS,
        state: { selectedServiceId: pendingAction.payload?.serviceId },
      }
    }

    const isAdmin = role === USER_ROLES.ADMIN
    if (from && (isAdmin ? from !== ROUTES.USER_DASHBOARD : !ADMIN_ONLY_ROUTES.has(from))) {
      return { path: from }
    }
    return { path: isAdmin ? ROUTES.DASHBOARD : ROUTES.USER_DASHBOARD }
  }

  // Auto-redirect if already authenticated (covers Google sign-in redirect return)
  useEffect(() => {
    if (!loading && !loadingRole && isAuthenticated) {
      const dest = resolveDestination()
      navigate(dest.path, { replace: true, state: dest.state })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingRole, isAuthenticated, role, navigate])

  const handlePostLogin = () => {
    const dest = resolveDestination()
    navigate(dest.path, { replace: true, state: dest.state })
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // ─── Email login ─────────────────────────────────────────────────────────
  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password)
      toast.success('¡Bienvenido de vuelta!')
      handlePostLogin()
    } catch (error) {
      const message = getFirebaseErrorMessage(error.code)
      toast.error(message)
    }
  }

  // ─── Google login ─────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    console.log('[AUDIT TEMP LoginPage] handleGoogleLogin — Inicio login Google (click)')
    setIsGoogleLoading(true)
    try {
      await loginWithGoogle()
      console.log('[AUDIT TEMP LoginPage] handleGoogleLogin — loginWithGoogle completado sin excepciones')
      toast.success('¡Bienvenida!')
      handlePostLogin()
    } catch (error) {
      console.error('[AUDIT TEMP LoginPage] handleGoogleLogin — catch disparado. Detalle del ERROR:', {
        error: error,
        code: error.code,
        message: error.message,
        stack: error.stack
      })
      toast.error('No se pudo iniciar sesión con Google')
    } finally {
      setIsGoogleLoading(false)
      console.log('[AUDIT TEMP LoginPage] handleGoogleLogin — FINALIZADO (finally)')
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-brand-bg md:flex-row">
      {/* ── Branding Panel (Image — top on mobile, left on desktop) ─────────────── */}
      <aside className="relative flex min-h-[32vh] w-full flex-col items-center justify-center overflow-hidden py-8 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.55)] sm:min-h-[38vh] sm:py-14 md:min-h-0 md:w-2/5 md:py-0 lg:w-1/2">
        {/* Background image — Instagram flyer.
            object-cover: never distorts, never black bars.
            object-position: on mobile the flyer is shown from its focal point
            (50% horizontal, 35% vertical) so the hero crops toward the subject
            instead of showing an arbitrary middle band; from md+ (tablet/desktop)
            the panel is a tall side column, so centering shows the full flyer. */}
        <img
          src="/imgParaLogin.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[50%_35%] md:object-center"
        />

        {/* Overlay for legibility — rgba(0,0,0,.35) */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Depth gradient — keeps the centered content crisp */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Branding content — rendered by React, overlaid on the image */}
        <div
          className="relative z-10 flex flex-col items-center justify-center gap-2.5 px-6 text-center -translate-y-1 sm:gap-4 sm:-translate-y-1.5"
          style={{ animation: 'fade-in-scale 400ms ease-out forwards' }}
        >
          {/* Logo */}
          <div className="flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/20 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.35)] 
                          h-14 w-14 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 xl:h-32 xl:w-32">
            {/* object-contain: nunca deforma ni recorta. scale-[1.18]: compensa el
                padding transparente del asset (contenido real ≈72%×78% del lienzo)
                para ocupar ~92% de la altura del círculo sin tocar el borde
                (distancia máx. del contenido: 793px × 1.18 = 936px < 1000px del radio). */}
            <img
              src="/LogoOficial.png"
              alt={`${APP_NAME} Logo`}
              className="h-full w-full max-w-none object-contain scale-[1.18]"
            />
          </div>
          {/* Brand name */}
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {APP_NAME}
          </h1>
          {/* Subtitle */}
          <p className="max-w-sm text-sm font-medium leading-relaxed text-white/80 md:text-base">
            Gestioná tu barbería de forma simple.
          </p>
          {/* Gold accent line */}
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
        </div>
      </aside>

      {/* ── Right panel: Login form ────────────────────────────────────────── */}
      <main className="flex w-full flex-col items-center justify-center px-5 py-10 sm:px-6 md:w-3/5 md:px-10 md:py-0 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
              Bienvenido
            </h2>
            <p className="mt-1.5 text-sm font-medium text-brand-text-muted">
              Iniciá sesión para acceder a tu cuenta
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-brand-subtle sm:p-8">
            {/* Email/Password form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              <Input
                label="Email"
                type="email"
                id="login-email"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder="••••••••"
                autoComplete="current-password"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="text-brand-text-muted hover:text-brand-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Forgot password link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isSubmitting}
                className="mt-2"
              >
                Ingresar
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-brand-border" />
              <span className="text-xs font-medium text-brand-text-muted">o continuá con</span>
              <div className="h-px flex-1 bg-brand-border" />
            </div>

            {/* Google login */}
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              loading={isGoogleLoading}
              onClick={handleGoogleLogin}
              leftIcon={
                !isGoogleLoading && (
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )
              }
            >
              Continuar con Google
            </Button>

            {/* Link to register */}
            <p className="mt-6 text-center text-sm font-medium text-brand-text-muted">
              ¿No tenés cuenta?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-brand-primary hover:text-brand-primary-hover hover:underline"
              >
                Registrate
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs font-medium text-brand-text-muted/60">
            {APP_NAME} © {new Date().getFullYear()}. Sistema de gestión privado.
          </p>
        </div>
      </main>
    </div>
  )
}

/**
 * Translate Firebase auth error codes to user-friendly Spanish messages.
 * @param {string} code - Firebase error code
 * @returns {string}
 */
function getFirebaseErrorMessage(code) {
  const messages = {
    'auth/invalid-credential': 'Email o contraseña incorrectos',
    'auth/user-not-found': 'No existe una cuenta con ese email',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/too-many-requests': 'Demasiados intentos. Intentá más tarde',
    'auth/user-disabled': 'Esta cuenta fue deshabilitada',
    'auth/network-request-failed': 'Error de conexión. Verificá tu internet',
  }
  return messages[code] || 'Ocurrió un error al iniciar sesión'
}

export default LoginPage
