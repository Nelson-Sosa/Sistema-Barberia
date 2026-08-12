import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBenefitsCounts,
  redeemDiscount,
  subscribeBenefitsHistory,
  subscribeLastBenefitsEvent,
} from '@/services/benefits/benefitsService'
import {
  subscribeBenefitsSettings,
  updateBenefitsSettings,
} from '@/services/settings/settingsService'
import { useClients } from '@/hooks/useClients'
import { createRealtimeQuery } from '@/lib/firestoreRealtime'

const BENEFITS_KEY = 'benefits'

/**
 * Fetch the salon's benefits program settings in real time.
 */
export function useBenefitsSettings() {
  return useQuery({
    queryKey: [BENEFITS_KEY, 'settings'],
    queryFn: createRealtimeQuery(subscribeBenefitsSettings),
    refetchOnMount: 'always',
  })
}

/**
 * Mutation: save the benefits program settings.
 */
export function useUpdateBenefitsSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateBenefitsSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BENEFITS_KEY, 'settings'] })
    },
  })
}

/**
 * Fetch benefits/reward history for a specific client in real time.
 * Updates instantly when a visit is completed or a reward is redeemed.
 * @param {string} clientId
 */
export function useBenefitsHistory(clientId) {
  return useQuery({
    queryKey: [BENEFITS_KEY, 'history', clientId],
    queryFn: createRealtimeQuery((onNext, onError) =>
      subscribeBenefitsHistory(clientId, onNext, onError)
    ),
    enabled: !!clientId,
    refetchOnMount: 'always',
  })
}

/**
 * Fetch the most recent benefits event for a client in real time.
 * @param {string} clientId
 */
export function useLastBenefitsEvent(clientId) {
  return useQuery({
    queryKey: [BENEFITS_KEY, 'lastEvent', clientId],
    queryFn: createRealtimeQuery((onNext, onError) =>
      subscribeLastBenefitsEvent(clientId, onNext, onError)
    ),
    enabled: !!clientId,
    refetchOnMount: 'always',
  })
}

/**
 * Mutation: redeem an available reward (discount or free service) for a client.
 */
export function useRedeemDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ clientId, adminUid }) => redeemDiscount(clientId, adminUid),
    onSuccess: (result, { clientId }) => {
      if (result?.success) {
        qc.invalidateQueries({ queryKey: ['clients'] })
        qc.invalidateQueries({ queryKey: [BENEFITS_KEY, 'history', clientId] })
        qc.invalidateQueries({ queryKey: [BENEFITS_KEY, 'lastEvent', clientId] })
      }
    },
  })
}

/**
 * Admin panel stats for the benefits program.
 * Derives most clients from the realtime client list (users + manual clients)
 * and aggregates rewards/redemptions from loyalty history counts.
 */
export function useBenefitsStats() {
  const clientsQuery = useClients()
  const settingsQuery = useBenefitsSettings()
  const [counts, setCounts] = useState({ granted: 0, redeemed: 0 })

  useEffect(() => {
    let active = true
    getBenefitsCounts().then((c) => {
      if (active) setCounts(c)
    })
    return () => {
      active = false
    }
  }, [])

  const data = useMemo(() => {
    const clients = clientsQuery.data ?? []
    const settings = settingsQuery.data
    const rewardEvery = settings?.rewardEveryVisits ?? 6

    const withRewards = clients.filter((c) => (c.freeServices ?? 0) > 0)

    const topVisits = [...clients]
      .sort((a, b) => (b.totalVisits ?? 0) - (a.totalVisits ?? 0))
      .slice(0, 5)

    const closeToReward = clients
      .filter((c) => {
        const remaining = (c.nextRewardAt ?? rewardEvery) - (c.totalVisits ?? 0)
        return remaining > 0 && remaining <= 2
      })
      .sort(
        (a, b) =>
          ((a.nextRewardAt ?? rewardEvery) - (a.totalVisits ?? 0)) -
          ((b.nextRewardAt ?? rewardEvery) - (b.totalVisits ?? 0))
      )
      .slice(0, 5)

    return {
      enabled: settings?.enabled ?? true,
      rewardDescription: settings?.rewardDescription,
      totalClients: clients.length,
      clientsWithRewards: withRewards.length,
      topVisits,
      closeToReward,
      granted: counts.granted,
      redeemed: counts.redeemed,
    }
  }, [clientsQuery.data, settingsQuery.data, counts])

  return {
    data,
    isLoading: clientsQuery.isLoading || settingsQuery.isLoading,
  }
}
