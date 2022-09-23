import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const wellKnownQueries = {
  getGitConfigurations: 'get-git-configurations',
  resetGitConfiguration: 'reset-git-configuration',
}

export function useGetGitConfigurationList() {
  return useQuery(
    [wellKnownQueries.getGitConfigurations],
    async () => window.GitConfigFilesList.invoke(),
    { staleTime: Infinity }
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
        queryClient.invalidateQueries([wellKnownQueries.getGitConfigurations])
      },
    }
  )
}
