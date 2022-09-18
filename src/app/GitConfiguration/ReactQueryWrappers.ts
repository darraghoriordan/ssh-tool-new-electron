import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApplicationSettings } from '../../electron/appSettings/ApplicationSettings'

export const wellKnownQueries = {
  getGitConfigurations: 'get-git-configurations',
  saveGitConfiguration: 'save-git-configuration',
}

type GetGitConfigurationsContext = {
  forceFileSystemSearch: boolean
}
export function useGetGitConfigurationList(
  options: GetGitConfigurationsContext
) {
  return useQuery(
    [wellKnownQueries.getGitConfigurations, options.forceFileSystemSearch],
    async ({ queryKey }) =>
      window.ScanGitConfigFiles.invoke({
        forceFileSystemSearch: queryKey[1] === true || queryKey[1] === 'true',
      }),
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
