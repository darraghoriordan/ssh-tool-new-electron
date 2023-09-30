import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import { UserSettingsResponse } from '../../electron/userSettings/channels/MessageTypes'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  getUserSettings: 'get-user-settings',
  saveUserSettings: 'save-user-settings',
  resetUserSettings: 'reset-user-settings',
  selectGitProjectsPath: 'select-git-projects-path',
  selectGitConfigFilePath: 'select-git-config-file-path',
  selectSshConfigFilePath: 'select-ssh-config-file-path',
}

export function useGetSettings() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useQuery<UserSettingsResponse, { message: string }>(
    [wellKnownQueries.getUserSettings],
    async () => window.LoadUserSettings.invoke(),
    {
      staleTime: Infinity,
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
    },
  )
}

export function useSaveSettings() {
  const queryClient = useQueryClient()
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

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
    },
  )
}

export function useResetSettings() {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

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
    },
  )
}

export function useSelectGitProjectsPath() {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.selectGitProjectsPath],
    async (): Promise<UserSettingsResponse> => {
      return window.SelectGitProjectsPath.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.selectGitProjectsPath} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getUserSettings])
      },
    },
  )
}

export function useSelectSshConfigFilePath() {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.selectSshConfigFilePath],
    async (): Promise<UserSettingsResponse> => {
      return window.SelectSshConfigFilePath.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.selectSshConfigFilePath} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getUserSettings])
      },
    },
  )
}

export function useSelectChromeHistoryFilePath() {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.selectSshConfigFilePath],
    async (): Promise<UserSettingsResponse> => {
      return window.SelectChromeHistoryFilePath.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.selectSshConfigFilePath} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getUserSettings])
      },
    },
  )
}

export function useSelectGitConfigFilePath() {
  const queryClient = useQueryClient()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<UserSettingsResponse, { message: string }, void, unknown>(
    [wellKnownQueries.selectGitConfigFilePath],
    async (): Promise<UserSettingsResponse> => {
      return window.SelectGitConfigFilePath.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.selectGitConfigFilePath} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: 'invalidating current settings cache.',
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getUserSettings])
      },
    },
  )
}
