import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationSettings } from '../../electron/appSettings/ApplicationSettings'

export const wellKnownQueries = {
  getSettings: 'get-settings',
  saveSettings: 'save-settings',
}

export function useGetSettings() {
  return useQuery(
    [wellKnownQueries.getSettings],
    async () => window.LoadSettings.invoke(),
    { staleTime: Infinity }
  )
}

export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation(
    [wellKnownQueries.saveSettings],
    async (settings: ApplicationSettings) =>
      window.SaveSettings.invoke({ settings }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([wellKnownQueries.getSettings])
      },
    }
  )
}
