import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationSettings } from '../../electron/appSettings/models/ApplicationSettings'

export const wellKnownQueries = {
  getGitConfigurations: 'get-git-configurations',
  saveGitConfiguration: 'save-git-configuration',
}

export function useGetGitConfigurationList() {
  return useQuery(
    [wellKnownQueries.getGitConfigurations],
    async () => window.GitConfigFilesList.invoke(),
    { staleTime: Infinity }
  )
}

export function useSaveSettings() {
  const queryClient = useQueryClient()

  return useMutation(
    [wellKnownQueries.getGitConfigurations],
    async (settings: ApplicationSettings) =>
      window.SaveSettings.invoke({ settings }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([wellKnownQueries.getGitConfigurations])
      },
    }
  )
}
