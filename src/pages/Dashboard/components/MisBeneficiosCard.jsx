import { useState } from 'react'
import { Gift, Sparkles, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { useBenefitsSettings } from '@/hooks/useBenefits'
import { cn } from '@/utils/cn'
import ProgressBar from '@/components/ui/ProgressBar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

function getMessage(progress, totalVisits, rewardEvery, rewardLabel) {
  if (totalVisits === 0) {
    return {
      title: 'Bienvenido',
      subtitle: 'Reserva tu primer turno y comienza a disfrutar de todos los beneficios.',
    }
  }

  if (progress === 0) {
    return {
      title: '¡Felicidades!',
      subtitle: `Ya tienes ${rewardLabel} disponible.`,
      isReward: true,
    }
  }

  if (progress <= Math.floor(rewardEvery / 2)) {
    return {
      title: '¡Excelente comienzo!',
      subtitle: 'Cada visita te acerca a una recompensa.',
    }
  }

  const remaining = rewardEvery - progress
  return {
    title: '¡Ya casi llegas!',
    subtitle: `Solo te faltan ${remaining} visita${remaining !== 1 ? 's' : ''} para desbloquear ${rewardLabel}.`,
  }
}

function MisBeneficiosCard({ totalVisits }) {
  const navigate = useNavigate()
  const { data: settings } = useBenefitsSettings()
  const [showModal, setShowModal] = useState(false)

  const rewardEvery = settings?.rewardEveryVisits ?? 6
  const rewardLabel = settings?.rewardDescription || '20% de descuento'
  const showProgress = settings?.showProgress ?? true

  if (!showProgress) return null

  const progress = totalVisits % rewardEvery
  const rewardReady = totalVisits > 0 && progress === 0
  const displayProgress = rewardReady ? rewardEvery : progress
  const msg = getMessage(progress, totalVisits, rewardEvery, rewardLabel)

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.2)]">
        {rewardReady && (
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-brand-gold/10 blur-3xl" />
        )}

        <div className="relative space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl border border-brand-border bg-brand-alt-row',
                rewardReady && 'border-brand-gold/30 bg-brand-gold/10'
              )}
            >
              <Gift
                className={cn('h-5 w-5', rewardReady ? 'text-brand-gold' : 'text-brand-primary')}
              />
            </span>
            <div>
              <p className="text-sm font-medium text-brand-text">Mis Beneficios</p>
              <p className="text-xs text-brand-text-muted">Cada visita te acerca a nuevas recompensas.</p>
            </div>
          </div>

          {/* Message */}
          <div className="flex items-start gap-2">
            {msg.isReward && <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />}
            <div>
              <p
                className={cn(
                  'text-sm font-medium',
                  msg.isReward ? 'text-brand-gold' : 'text-brand-text'
                )}
              >
                {msg.title}
              </p>
              <p className="mt-0.5 text-xs text-brand-text-muted">{msg.subtitle}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2.5">
            <ProgressBar value={displayProgress} max={rewardEvery} />
            <p className="text-xs text-brand-text-muted">
              {displayProgress} de {rewardEvery} visitas
            </p>
          </div>

          {/* Reward badge */}
          {rewardReady && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1">
              <Gift className="h-3.5 w-3.5 text-brand-gold" />
              <span className="text-xs font-semibold text-brand-gold">
                {rewardLabel.toUpperCase()} DISPONIBLE
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="pt-1">
            {rewardReady ? (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-gold/40 px-4 py-2 text-xs font-semibold text-brand-gold transition-all duration-200 hover:bg-brand-gold/10 active:scale-[0.97]"
              >
                Ver recompensa
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate(ROUTES.APPOINTMENTS)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-brand-primary-hover active:scale-[0.97]"
              >
                Reservar turno
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reward modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          maxWidthClass="max-w-sm"
          hideHeader
          bodyClassName="p-6"
          footer={
            <Button
              onClick={() => {
                setShowModal(false)
                navigate(ROUTES.APPOINTMENTS)
              }}
              className="w-full"
            >
              Reservar turno
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10">
              <Gift className="h-7 w-7 text-brand-gold" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-brand-text">Recompensa disponible</h2>
              <p className="mt-2 text-sm text-brand-text-muted leading-relaxed">
                Ya puedes reclamar {rewardLabel.toLowerCase()} en tu próxima visita.
              </p>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

export default MisBeneficiosCard