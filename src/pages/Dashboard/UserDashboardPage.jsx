import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, ArrowRight, AlertCircle, Scissors } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppointmentsByClient } from '@/hooks/useAppointments'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { STATUS_CONFIG } from '@/constants/app'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Badge from '@/components/ui/Badge'
import MisBeneficiosCard from './components/MisBeneficiosCard'
import UserBenefitsCard from './components/UserBenefitsCard'

const HOURS_12 = 12 * 60 * 60 * 1000

function getAptDate(apt) {
  if (apt.date?.toDate) return apt.date.toDate()
  if (apt.date?.seconds) return new Date(apt.date.seconds * 1000)
  return new Date(apt.date)
}

function UserDashboardPage() {
  usePageTitle('Mi Dashboard')

  const { user, userProfile, role } = useAuth()
  const navigate = useNavigate()
  const clientId = userProfile?.uid || user?.uid
  const { data: appointments } = useAppointmentsByClient(clientId)

  const totalVisits = userProfile?.totalVisits ?? 0

  const futureAppointments = useMemo(() => {
    if (!appointments) return []
    const now = Date.now()
    return appointments.filter((apt) => {
      const aptDate = getAptDate(apt)
      return aptDate.getTime() > now - HOURS_12
    })
  }, [appointments])

  const upcoming = futureAppointments[0] || null

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
          Hola, {userProfile?.displayName || user?.displayName || 'Bienvenido'}
        </h1>
        <p className="mt-1 text-sm text-brand-text-muted">
          {totalVisits === 0
            ? 'Comienza tu experiencia en la barbería.'
            : `Tienes ${totalVisits} visita${totalVisits !== 1 ? 's' : ''} completada${totalVisits !== 1 ? 's' : ''}.`
          }
        </p>
      </div>

      {/* ── Mis Beneficios (solo usuarios) ── */}
      {role === 'user' && <MisBeneficiosCard totalVisits={totalVisits} />}

      {/* ── Welcome Card (no visits) ── */}
      {totalVisits === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-brand-gold">
              <Scissors className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-base font-semibold text-brand-text">Bienvenido a la barbería</p>
              <p className="mt-1 text-sm text-brand-text-muted leading-relaxed">
                Reserva tu primer turno y comienza a disfrutar de todos los beneficios.
              </p>
              <button
                onClick={() => navigate(ROUTES.APPOINTMENTS)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-primary-hover active:scale-[0.97]"
              >
                Reservar turno
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Next Appointment Card ── */}
      {upcoming ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)]"
        >
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-alt-row text-brand-primary">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-brand-text">Próximo turno</p>
              <p className="text-xs text-brand-text-muted">{upcoming.serviceName || 'Sin servicio'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl bg-brand-alt-row/60 border border-brand-border px-4 py-3">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-brand-text-muted" />
              <div>
                <p className="text-sm font-medium text-brand-text">{upcoming.time}</p>
                <p className="text-xs text-brand-text-muted">
                  {format(getAptDate(upcoming), "d 'de' MMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
            <Badge variant={STATUS_CONFIG[upcoming.status]?.variant || 'default'} size="sm">
              {STATUS_CONFIG[upcoming.status]?.label || upcoming.status}
            </Badge>
          </div>

          <button
            onClick={() => navigate(ROUTES.APPOINTMENTS)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-gold transition-colors"
          >
            Ver mis turnos
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      ) : totalVisits > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-brand-border bg-brand-card p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.18)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-alt-row text-brand-text-muted">
              <AlertCircle className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-base font-semibold text-brand-text">No tienes turnos programados</p>
              <p className="mt-1 text-sm text-brand-text-muted leading-relaxed">
                Es un excelente momento para reservar tu próxima cita.
              </p>
              <button
                onClick={() => navigate(ROUTES.APPOINTMENTS)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-primary-hover active:scale-[0.97]"
              >
                Reservar ahora
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Benefits Card ── */}
      <UserBenefitsCard />
    </div>
  )
}

export default UserDashboardPage
