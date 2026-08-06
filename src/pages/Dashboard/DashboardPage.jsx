import { TrendingUp, Users, CalendarDays, Landmark, Clock, ChevronRight } from 'lucide-react'
import BenefitsCard from './components/BenefitsCard'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatters'
import { APPOINTMENT_STATUS, STATUS_CONFIG } from '@/constants/app'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { cn } from '@/utils/cn'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Mi\u00e9rcoles', 'Jueves', 'Viernes', 'S\u00e1bado']
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function DashboardPage() {
  usePageTitle('Dashboard')

  const { user, userProfile } = useAuth()
  const { data: stats, isLoading } = useDashboardStats()

  const displayName = userProfile?.displayName || user?.displayName || 'Bienvenido'
  const firstName = displayName.split(' ')[0]

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Buenos d\u00edas' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const dateStr = `${DAYS[now.getDay()]} ${now.getDate()} de ${MONTHS[now.getMonth()]}`

  const totalDone = stats?.topServices?.reduce((sum, s) => sum + s.count, 0) || 1

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const metrics = [
    { icon: CalendarDays, value: stats?.todayAppointmentsCount ?? 0, label: 'Turnos hoy' },
    { icon: Users, value: stats?.totalClients ?? 0, label: 'Clientes totales' },
    { icon: TrendingUp, value: formatCurrency(stats?.todayIncome ?? 0), label: 'Ingresos hoy' },
    { icon: Landmark, value: formatCurrency(stats?.monthIncome ?? 0), label: 'Ingresos del mes' },
  ]

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
            {greeting}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-brand-text-muted">
            Resumen operativo de la barbería
          </p>
          <p className="mt-1 text-xs text-brand-text-muted">
            {dateStr}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-brand-border bg-brand-card px-4 py-2 text-xs text-brand-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          En vivo
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {metrics.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="group flex flex-col rounded-2xl border border-brand-border bg-brand-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.2)] sm:p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-alt-row text-brand-primary">
              <Icon className="h-5 w-5" />
            </div>
            <p className="truncate text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
              {value}
            </p>
            <p className="mt-1 truncate text-xs text-brand-text-muted sm:text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Main Content (3-column grid at xl) ─────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">

        {/* ── Agenda de Hoy (spans 2 cols) ─────────────────────────────── */}
        <div className="xl:col-span-2">
          <Card>
            <Card.Header
              title="Agenda de Hoy"
              description="Tus turnos agendados para el día de hoy"
              action={
                <Link to={ROUTES.APPOINTMENTS} className="text-sm font-medium text-brand-primary transition-colors hover:text-brand-primary-hover">
                  Ver todos &rarr;
                </Link>
              }
            />
            <Card.Body className="space-y-2">
              {stats?.todayAppointmentsList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="mb-3 h-8 w-8 text-brand-text-muted" />
                  <p className="text-sm text-brand-text-muted">No hay turnos agendados para hoy.</p>
                </div>
              ) : (
                stats?.todayAppointmentsList?.slice(0, 5).map((app) => {
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG[APPOINTMENT_STATUS.PENDING]
                  const initial = (app.clientName || '?')[0].toUpperCase()
                  return (
                    <div
                      key={app.id}
                      className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 rounded-xl border border-transparent bg-transparent px-3 py-3 transition-all duration-200 hover:border-brand-border hover:bg-brand-alt-row/60 sm:px-4"
                    >
                      {/* Time */}
                      <div className="flex flex-col items-center gap-1 self-stretch justify-center">
                        <span className="text-sm font-semibold text-brand-text">{app.time}</span>
                        <div className="hidden h-5 w-0.5 rounded-full bg-brand-border sm:block" />
                      </div>

                      {/* Avatar with initial */}
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-semibold text-white">
                        {initial}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-medium text-brand-text sm:truncate">{app.clientName}</p>
                        <p className="mt-0.5 break-words text-xs text-brand-text-muted sm:truncate">{app.serviceName}</p>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-brand-text">{formatCurrency(app.price)}</p>
                      </div>

                      {/* Status badge */}
                      <Badge variant={cfg.variant} size="sm" className="justify-self-end shrink-0">{cfg.label}</Badge>
                    </div>
                  )
                })
              )}
            </Card.Body>
          </Card>
        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* ── Programa de Beneficios ──────────────────────────────────── */}
          <BenefitsCard />

          {/* ── Próximo Turno ───────────────────────────────────────────── */}
          <Card>
            <Card.Header title="Pr&oacute;ximo Turno" />
            <Card.Body>
              {stats?.nextAppointment ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-alt-row text-brand-primary">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-brand-text">
                        {stats.nextAppointment.time}
                      </p>
                      <p className="text-sm text-brand-text-muted">{stats.nextAppointment.clientName}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-border bg-brand-alt-row/60 px-4 py-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="shrink-0 text-brand-text-muted">Servicio</span>
                      <span className="min-w-0 truncate text-right font-medium text-brand-text">{stats.nextAppointment.serviceName}</span>
                    </div>
                  </div>
                  <Link
                    to={ROUTES.APPOINTMENTS}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-brand-border py-2.5 text-sm font-medium text-brand-text transition-all duration-200 hover:border-brand-primary/40 hover:text-brand-primary"
                  >
                    Ver turno
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="mb-3 h-8 w-8 text-brand-text-muted" />
                  <p className="text-sm text-brand-text-muted">No hay pr&oacute;ximos turnos.</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* ── Servicios más vendidos ──────────────────────────────────── */}
          <Card>
            <Card.Header title="Servicios m&aacute;s vendidos" />
            <Card.Body className="space-y-4">
              {stats?.topServices?.length > 0 ? (
                stats.topServices.map((svc) => {
                  const pct = Math.round((svc.count / totalDone) * 100)
                  return (
                    <div key={svc.name}>
                      <div className="mb-1.5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <span className="min-w-0 break-words text-sm font-medium text-brand-text sm:break-normal">{svc.name}</span>
                        <span className={cn('shrink-0 self-end text-xs text-brand-text-muted sm:self-auto')}>{pct}% &middot; {svc.count} turnos</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-brand-alt-row">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gold transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-6 text-center text-sm text-brand-text-muted">
                  Sin servicios este mes.
                </div>
              )}
            </Card.Body>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default DashboardPage
