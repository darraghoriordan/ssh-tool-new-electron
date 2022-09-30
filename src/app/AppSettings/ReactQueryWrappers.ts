import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppSettingsResponse } from '../../electron/appSettings/channels/MessageTypes'

export const wellKnownQueries = {
  getAppSettings: 'get-app-settings',
  updateFirstUsage: 'update-first-usage',
}

export function useGetAppSettings() {
  return useQuery<AppSettingsResponse, { message: string }>(
    [wellKnownQueries.getAppSettings],
    async () => window.LoadAppSettings.invoke(),
    { staleTime: Infinity }
  )
}

export function useSetFirstUsageDate() {
  const queryClient = useQueryClient()

  return useMutation<void, { message: string }, void, unknown>(
    [wellKnownQueries.updateFirstUsage],
    async () => {
      return window.SetFirstAppUsageDate.invoke()
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log(
          'Updating first usage date successful, invalidating current settings cache...'
        )
        queryClient.resetQueries([wellKnownQueries.getAppSettings])
      },
    }
  )
}
