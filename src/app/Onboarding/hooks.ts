import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetAppSettings } from '../AppSettings/ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useGetLicensing } from '../Licensing/ReactQueryWrappers'

export const useFirstRunRedirect = (): {
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

  const { data: licenceData, isLoading: licIsLd } = useGetLicensing()

  const navigateRoute = useNavigate()
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

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
    if (licenceData && licenceData.mustEnterLicenseKey === true) {
      logAMessage({
        message: `License not found. Redirecting to license screen.`,
        level: 'info',
      })

      navigateRoute('/licensing') // change to welcome screen
    }
  }, [appSettingsData, licenceData])

  return {
    isLoading: isLoadingGetAppSettings || licIsLd,
    error: getAppSettingsError,
    isError: getAppSettingsIsError,
  }
}
