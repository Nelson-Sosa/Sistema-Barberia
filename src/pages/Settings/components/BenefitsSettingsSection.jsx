import { useState } from 'react'
import { Save, ToggleLeft, ToggleRight, Loader } from 'lucide-react'
import {
  useBenefitsSettings,
  useUpdateBenefitsSettings,
} from '@/hooks/useBenefits'
import { buildRewardDescription } from '@/services/settings/settingsService'
import { BENEFITS } from '@/constants/app'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

const ACCUMULATION_OPTIONS = [
  { value: BENEFITS.ACCUMULATION_TYPES.VISITS, label: 'Por visitas' },
  { value: BENEFITS.ACCUMULATION_TYPES.SERVICES, label: 'Por servicios' },
]

const REWARD_TYPE_OPTIONS = [
  { value: BENEFITS.REWARD_TYPES.DISCOUNT, label: 'Descuento %' },
  { value: BENEFITS.REWARD_TYPES.FREE_SERVICE, label: 'Servicio gratis' },
]

/**
 * BenefitsSettingsSection
 *
 * Admin form for configuring the loyalty program (settings/salon → loyaltyProgram).
 * The reward type is global to the program: a discount % or a free service.
 */
export default function BenefitsSettingsSection() {
  const { data: settings, isLoading } = useBenefitsSettings()
  const { mutateAsync: saveSettings, isPending: isSaving } = useUpdateBenefitsSettings()

  const [form, setForm] = useState(null)

  if (settings && form === null) {
    setForm({
      enabled: settings.enabled ?? true,
      accumulationType: settings.accumulationType ?? BENEFITS.DEFAULT_ACCUMULATION_TYPE,
      rewardEveryVisits: settings.rewardEveryVisits ?? BENEFITS.DEFAULT_REWARD_EVERY_VISITS,
      rewardType: settings.rewardType ?? BENEFITS.REWARD_TYPE,
      rewardValue: settings.rewardValue ?? BENEFITS.DEFAULT_REWARD_VALUE,
      repeatEnabled: settings.repeatEnabled ?? BENEFITS.DEFAULT_REPEAT_ENABLED,
      rewardValidDays: settings.rewardValidDays ?? BENEFITS.DEFAULT_REWARD_VALID_DAYS,
      showProgress: settings.showProgress ?? true,
    })
  }

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    if (!form) return
    try {
      const threshold = Math.max(Number(form.rewardEveryVisits) || 1, 1)
      const value = Math.max(Number(form.rewardValue) || 1, 1)
      const validDays = Math.max(Number(form.rewardValidDays) || 0, 0)
      const payload = {
        enabled: !!form.enabled,
        accumulationType: form.accumulationType,
        rewardEveryVisits: threshold,
        rewardIncrement: threshold,
        rewardType: form.rewardType,
        rewardValue: value,
        repeatEnabled: !!form.repeatEnabled,
        rewardValidDays: validDays,
        rewardDescription: buildRewardDescription(form.rewardType, value),
        showProgress: !!form.showProgress,
      }
      await saveSettings(payload)
      toast.success('Programa de beneficios actualizado')
    } catch {
      toast.error('No se pudo guardar la configuración')
    }
  }

  if (isLoading || form === null) {
    return (
      <div className="flex items-center gap-2 text-brand-text-muted py-6">
        <Loader className="h-4 w-4 animate-spin" />
        <span className="text-sm">Cargando configuración...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Enable toggle */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-card p-4">
        <div>
          <p className="text-sm font-semibold text-brand-text">Programa de fidelización</p>
          <p className="mt-0.5 text-xs text-brand-text-muted">
            Cuando está activo, los clientes acumulan recompensas al completar turnos.
          </p>
        </div>
        <Toggle value={form.enabled} onChange={(v) => set('enabled', v)} />
      </div>

      {form.enabled && (
        <>
          {/* ── Accumulation type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-text">
              Cómo se acumula
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ACCUMULATION_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('accumulationType', value)}
                  className={cn(
                    'rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                    form.accumulationType === value
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-brand-border text-brand-text-muted hover:border-brand-primary/30'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-brand-text-muted">
              {form.accumulationType === BENEFITS.ACCUMULATION_TYPES.SERVICES
                ? 'Cuenta cada servicio completado (ideal para turnos con varios servicios).'
                : 'Cuenta cada turno completado como una visita.'}
            </p>
          </div>

          {/* ── Threshold */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-text">
              {form.accumulationType === BENEFITS.ACCUMULATION_TYPES.SERVICES
                ? 'Servicios para obtener una recompensa'
                : 'Visitas para obtener una recompensa'}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={form.rewardEveryVisits}
              onChange={(e) => set('rewardEveryVisits', Number(e.target.value))}
              className="h-9 w-28 rounded-lg border border-brand-border bg-brand-bg px-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>

          {/* ── Reward type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-text">
              Tipo de recompensa
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REWARD_TYPE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('rewardType', value)}
                  className={cn(
                    'rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
                    form.rewardType === value
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-brand-border text-brand-text-muted hover:border-brand-primary/30'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {form.rewardType === BENEFITS.REWARD_TYPES.DISCOUNT && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.rewardValue}
                  onChange={(e) => set('rewardValue', Number(e.target.value))}
                  className="h-9 w-24 rounded-lg border border-brand-border bg-brand-bg px-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
                <span className="text-sm text-brand-text-muted">% de descuento</span>
              </div>
            )}
            {form.rewardType === BENEFITS.REWARD_TYPES.FREE_SERVICE && (
              <p className="text-xs text-brand-text-muted">
                El cliente recibirá un servicio sin cargo.
              </p>
            )}
          </div>

          {/* ── Repeat toggle */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-card p-4">
            <div>
              <p className="text-sm font-semibold text-brand-text">
                Repetir recompensa automáticamente
              </p>
              <p className="mt-0.5 text-xs text-brand-text-muted">
                Volver a otorgar una recompensa en cada nuevo ciclo alcanzado. Si lo desactivás,
                solo se otorga una vez por cliente.
              </p>
            </div>
            <Toggle value={form.repeatEnabled} onChange={(v) => set('repeatEnabled', v)} />
          </div>

          {/* ── Validity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-brand-text">
              Vigencia de la recompensa
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={365}
                value={form.rewardValidDays}
                onChange={(e) => set('rewardValidDays', Number(e.target.value))}
                className="h-9 w-28 rounded-lg border border-brand-border bg-brand-bg px-3 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
              />
              <span className="text-sm text-brand-text-muted">días</span>
            </div>
            <p className="text-xs text-brand-text-muted">
              Ingresá 0 para que las recompensas no venzan.
            </p>
          </div>

          {/* ── Show progress toggle */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-brand-border bg-brand-card p-4">
            <div>
              <p className="text-sm font-semibold text-brand-text">Mostrar progreso al cliente</p>
              <p className="mt-0.5 text-xs text-brand-text-muted">
                El cliente puede ver su avance y las recompensas disponibles en su panel.
              </p>
            </div>
            <Toggle value={form.showProgress} onChange={(v) => set('showProgress', v)} />
          </div>
        </>
      )}

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors',
            'hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'shrink-0 rounded-xl p-1 transition-colors',
        value ? 'text-brand-primary' : 'text-brand-text-muted'
      )}
    >
      {value
        ? <ToggleRight className="h-8 w-8" />
        : <ToggleLeft className="h-8 w-8" />}
    </button>
  )
}