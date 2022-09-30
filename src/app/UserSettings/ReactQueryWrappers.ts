import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import { UserSettingsResponse } from '../../electron/userSettings/channels/MessageTypes'

export const wellKnownQueries = {
  getSettings: 'get-settings',
  saveSettings: 'save-settings',
  resetSettings: 'reset-settings',
  updateFirstUsage: 'update-first-usage',
}

export function useGetSettings() {
  return useQuery<UserSettingsResponse, { message: string }>(
    [wellKnownQueries.getSettings],
    async () => window.LoadUserSettings.invoke(),
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
        queryClient.invalidateQueries([wellKnownQueries.getSettings])
      },
    }
  )
}

export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation<
    UserSettingsResponse,
    { message: string },
    UserSettings,
    unknown
  >(
    [wellKnownQueries.saveSettings],
    async (settings: UserSettings) => {
      return window.SaveUserSettings.invoke({ settings })
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

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.resetSettings],
    async (): Promise<UserSettingsResponse> => {
      return window.ResetUserSettings.invoke()
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
