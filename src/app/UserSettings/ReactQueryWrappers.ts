import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import { UserSettingsResponse } from '../../electron/userSettings/channels/MessageTypes'

export const wellKnownQueries = {
  getUserSettings: 'get-user-settings',
  saveUserSettings: 'save-user-settings',
  resetUserSettings: 'reset-user-settings',
}

export function useGetSettings() {
  return useQuery<UserSettingsResponse, { message: string }>(
    [wellKnownQueries.getUserSettings],
    async () => window.LoadUserSettings.invoke(),
    { staleTime: Infinity }
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
    [wellKnownQueries.saveUserSettings],
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
        queryClient.invalidateQueries([wellKnownQueries.getUserSettings])
      },
    }
  )
}

export function useResetSettings() {
  const queryClient = useQueryClient()

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.resetUserSettings],
    async (): Promise<UserSettingsResponse> => {
      return window.ResetUserSettings.invoke()
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Reset settings successful, clearing cache.')
        queryClient.invalidateQueries([wellKnownQueries.getUserSettings])
      },
    }
  )
}
