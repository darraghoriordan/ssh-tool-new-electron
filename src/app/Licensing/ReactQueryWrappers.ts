import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { SetLicenseKeyRequest } from '../../electron/licencing/channels/SetLicenseKeyChannelSub'
import { LicenseDataDto } from '../../electron/licencing/models/LicenseDataDto'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  setLicenseKey: 'set-license-key',
  loadLicensingData: 'load-licensing-data',
}

export function useGetLicensing() {
  return useQuery<LicenseDataDto, { message: string }>(
    [wellKnownQueries.loadLicensingData],
    async () => {
      return await window.LoadLicensing.invoke()
    },
    {
      staleTime: Infinity,
      retry: false,
    }
  )
}

export function useSetLicensing() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const queryClient = useQueryClient()

  return useMutation<
    LicenseDataDto,
    { message: string },
    SetLicenseKeyRequest,
    unknown
  >(
    [wellKnownQueries.setLicenseKey],
    async variables => {
      return window.SetLicenseKey.invoke({ licenseKey: variables.licenseKey })
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.setLicenseKey} completed successfully.`,
          level: 'info',
        })
        logAMessage({
          message: `invalidating ${wellKnownQueries.loadLicensingData} cache.`,
          level: 'info',
        })
        queryClient.resetQueries([wellKnownQueries.loadLicensingData])
      },
    }
  )
}
