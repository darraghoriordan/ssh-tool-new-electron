import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { ControlFunctions } from 'use-debounce'
import { GitConfigListResponse } from '../../electron/gitConfigurations/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  getGitConfigurations: 'get-git-configurations',
  resetGitConfiguration: 'reset-git-configuration',
}

export function useGetGitConfigurationList(
  debouncedFilter: [string | undefined, ControlFunctions],
  filter: string | undefined
) {
  return useQuery<GitConfigListResponse, { message: string }>(
    [wellKnownQueries.getGitConfigurations, filter],
    async () => {
      return await window.GitConfigFilesList.invoke({ filter })
    },
    {
      staleTime: Infinity,
      retry: false,
    }
  )
}

export function useResetCache() {
  const queryClient = useQueryClient()
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<void, { message: string }, void, unknown>(
    [wellKnownQueries.resetGitConfiguration],
    async (): Promise<void> => {
      return window.RescanGithubConfigs.invoke()
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.resetGitConfiguration} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: `invalidating ${wellKnownQueries.getGitConfigurations} cache.`,
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.getGitConfigurations])
      },
    }
  )
}
