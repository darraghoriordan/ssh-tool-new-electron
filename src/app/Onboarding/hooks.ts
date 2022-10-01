import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAppSettings } from '../AppSettings/ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const useStartupRedirects = (): {
  isLoading: boolean
  error: { message: string } | null
  isError: boolean
} => {
  const {
    isLoading: isLoadingGetAppSettings,
    data: appSettingsData,
    error: getAppSettingsError,
    isError: getAppSettingsIsError,
  } = useGetAppSettings()
  const navigateRoute = useNavigate()
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  // REDIRECT IF FIRST TIME USED!
  useEffect(() => {
    if (
      appSettingsData &&
      appSettingsData.storedApplicationSettings.firstRunDate === undefined
    ) {
      logAMessage({
        message: `First time starting up detected. Redirecting to onboarding flow.`,
        level: 'info',
      })

      navigateRoute('/onboarding') // change to welcome screen
    }
  }, [appSettingsData, navigateRoute])

  return {
    isLoading: isLoadingGetAppSettings,
    error: getAppSettingsError,
    isError: getAppSettingsIsError,
  }
}
