import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ControlFunctions } from 'use-debounce'
import { GitConfigListResponse } from '../../electron/gitConfigurations/channels/MessageTypes'

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

  return useMutation<void, { message: string }, void, unknown>(
    [wellKnownQueries.resetGitConfiguration],
    async (): Promise<void> => {
      return window.RescanGithubConfigs.invoke()
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Reset git caches successful, clearing cache.')
        queryClient.resetQueries([wellKnownQueries.getGitConfigurations])
        // queryClient.refetchQueries([wellKnownQueries.getGitConfigurations])
      },
    }
  )
}
