import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import { UserSettingsResponse } from '../../electron/userSettings/channels/MessageTypes'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  getUserSettings: 'get-user-settings',
  saveUserSettings: 'save-user-settings',
  resetUserSettings: 'reset-user-settings',
}

export function useGetSettings() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  return useQuery<UserSettingsResponse, { message: string }>(
    [wellKnownQueries.getUserSettings],
    async () => window.LoadUserSettings.invoke(),
    {
      staleTime: Infinity,
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
    }
  )
}

export function useSaveSettings() {
  const queryClient = useQueryClient()
  const [logMessages, logAMessage] = useContext(ConsoleContext)

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
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.saveUserSettings} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.invalidateQueries([wellKnownQueries.getUserSettings])
      },
    }
  )
}

export function useResetSettings() {
  const queryClient = useQueryClient()
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.resetUserSettings],
    async (): Promise<UserSettingsResponse> => {
      return window.ResetUserSettings.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.resetUserSettings} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getUserSettings])
      },
    }
  )
}
