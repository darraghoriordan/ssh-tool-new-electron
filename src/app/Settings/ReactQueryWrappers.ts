import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationSettings } from '../../electron/appSettings/models/ApplicationSettings'
import { SettingsResponse } from '../../electron/appSettings/channels/MessageTypes'

export const wellKnownQueries = {
  getSettings: 'get-settings',
  saveSettings: 'save-settings',
  resetSettings: 'reset-settings',
}

export function useGetSettings() {
  return useQuery<SettingsResponse, { message: string }>(
    [wellKnownQueries.getSettings],
    async () => window.LoadSettings.invoke(),
    { staleTime: Infinity }
  )
}

export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation<
    SettingsResponse,
    { message: string },
    ApplicationSettings,
    unknown
  >(
    [wellKnownQueries.saveSettings],
    async (settings: ApplicationSettings) => {
      return window.SaveSettings.invoke({ settings })
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log(
          'Saving settings successful, invalidating current settings cache...'
        )
        queryClient.invalidateQueries([wellKnownQueries.getSettings])
      },
    }
  )
}

export function useResetSettings() {
  const queryClient = useQueryClient()

  return useMutation<SettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.resetSettings],
    async (): Promise<SettingsResponse> => {
      return window.ResetSettings.invoke()
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Reset settings successful, clearing cache.')
        queryClient.invalidateQueries([wellKnownQueries.getSettings])
      },
    }
  )
}
