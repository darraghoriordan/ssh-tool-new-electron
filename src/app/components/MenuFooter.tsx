import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { ReactElement } from 'react'
import { NavLink } from 'react-router-dom'
import { useGetAppSettings } from '../AppSettings/ReactQueryWrappers'
import { useGetLicensing } from '../Licensing/ReactQueryWrappers'

export const MenuFooter = () => {
  const { isLoading, data } = useGetAppSettings()
  const { isLoading: isLL, data: dataLL } = useGetLicensing()
  const openSubmitFeedback = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    window.OpenSubmitFeedback.invoke()
  }

  if (isLoading || isLL) {
    return <div>Loading...</div>
  }

  const getLicenceBlock = (): ReactElement | undefined => {
    if (!dataLL) {
      return undefined
    }
    if (dataLL.isTrialling) {
      return (
        <>
          <p className="text-xs text-center text-gray-300 font-mono">
            {`Trial (${dataLL.trialRemainingDays} days remaining)`}
          </p>
          <p>
            <NavLink
              to="/licensing"
              className="text-pink-400 hover:text-gray-100 underline"
            >
              Buy now
            </NavLink>
          </p>
        </>
      )
    }

    return (
      <p className="text-xs text-center text-gray-300 font-mono">
        {`Licenced `}

        <NavLink
          to="/licensing"
          className="text-xs text-gray-300 hover:text-gray-100 underline"
        >
          View license details
        </NavLink>
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center mb-4 space-y-1">
      <button
        onClick={e => openSubmitFeedback(e)}
        title="Submit Feedback - opens in a browser"
        type="button"
        className="font-mono inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <EnvelopeIcon className="h-5 w-5 mr-2" />
        Submit Feedback
      </button>
      <p className="text-center text-gray-300 font-mono">
        version {data?.runtimeApplicationSettings.appVersion || 'unknown'}
      </p>

      {getLicenceBlock()}
    </div>
  )
}
