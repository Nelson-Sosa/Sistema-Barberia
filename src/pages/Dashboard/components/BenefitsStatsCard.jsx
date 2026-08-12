import { Gift, Users, Sparkles, Award, ChevronRight, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { useBenefitsStats } from '@/hooks/useBenefits'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import { cn } from '@/utils/cn'

/**
 * BenefitsStatsCard
 *
 * Admin dashboard panel with loyalty program KPIs:
 * rewards granted/redeemed, clients with an available reward, clients close
 * to the next reward, and the clients with the most visits.
 */
function BenefitsStatsCard() {
  const { data: stats, isLoading } = useBenefitsStats()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Card>
        <Card.Body className="flex h-32 items-center justify-center">
          <Spinner size="md" />
        </Card.Body>
      </Card>
    )
  }

  if (!stats?.enabled) {
    return (
      <Card>
        <Card.Body className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-border bg-brand-alt-row text-brand-text-muted">
              <Gift className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-brand-text">Programa de Beneficios</p>
              <p className="text-[11px] text-brand-text-muted">Programa desactivado</p>
            </div>
          </div>
          <button
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary transition-colors hover:text-brand-gold"
          >
            <Settings className="h-3.5 w-3.5" />
            Configurar el programa
            <ChevronRight className="h-3 w-3" />
          </button>
        </Card.Body>
      </Card>
    )
  }

  const rewardLabel = stats.rewardDescription || 'recompensa'
  const metrics = [
    { icon: Award, value: stats.granted ?? 0, label: 'Recompensas entregadas' },
    { icon: Sparkles, value: stats.redeemed ?? 0, label: 'Canjes realizados' },
    { icon: Users, value: stats.clientsWithRewards ?? 0, label: 'Con recompensa disponible' },
    { icon: Gift, value: stats.closeToReward?.length ?? 0, label: 'Próximos a recompensa' },
  ]

  return (
    <Card>
      <Card.Header
        title="Beneficios"
        description={rewardLabel}
        action={
          <button
            onClick={() => navigate(ROUTES.CLIENTS)}
            className="text-xs font-medium text-brand-primary transition-colors hover:text-brand-gold"
          >
            Ver &rarr;
          </button>
        }
      />
      <Card.Body className="space-y-5">
        {/* ── Mini metrics ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col gap-1.5 rounded-xl border border-brand-border bg-brand-alt-row/50 p-3"
            >
              <Icon className="h-4 w-4 text-brand-primary" />
              <span className="text-xl font-bold tracking-tight text-brand-text">{value}</span>
              <span className="text-[11px] leading-tight text-brand-text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Top clients by visits ────────────────────────────────────── */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand-text-muted">
            Clientes con más visitas
          </p>
          {stats.topVisits?.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              {stats.topVisits.map((c, i) => {
                const initial = (c.name || '?')[0].toUpperCase()
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-brand-alt-row/60"
                  >
                    <span
                      className={cn(
                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white',
                        i === 0 ? 'bg-brand-gold' : 'bg-brand-primary'
                      )}
                    >
                      {initial}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-brand-text">
                      {c.name}
                    </span>
                    <span className="shrink-0 text-xs text-brand-text-muted">
                      {c.totalVisits ?? 0} visitas
                    </span>
                    {(c.freeServices ?? 0) > 0 && (
                      <Badge variant="success" size="sm" className="shrink-0">
                        Recompensa
                      </Badge>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-xs text-brand-text-muted">
              Sin visitas registradas todavía.
            </p>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default BenefitsStatsCard