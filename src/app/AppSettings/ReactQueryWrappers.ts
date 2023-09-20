import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { AppSettingsResponse } from '../../electron/appSettings/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  getAppSettings: 'get-app-settings',
  updateFirstUsage: 'update-first-usage',
}

export function useGetAppSettings() {
  return useQuery<AppSettingsResponse, { message: string }>(
    [wellKnownQueries.getAppSettings],
    async () => window.LoadAppSettings.invoke(),
    { staleTime: Infinity },
  )
}

export function useSetFirstUsageDate() {
  const queryClient = useQueryClient()
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<void, { message: string }, void, unknown>(
    [wellKnownQueries.updateFirstUsage],
    async () => {
      return window.SetFirstAppUsageDate.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.updateFirstUsage} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getAppSettings])
      },
    },
  )
}
