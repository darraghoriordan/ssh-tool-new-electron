import { EnvelopeIcon } from '@heroicons/react/24/outline'
import { useGetSettings } from '../Settings/ReactQueryWrappers'

export const MenuFooter = () => {
  const { isLoading, data, error } = useGetSettings()

  const openSubmitFeedback = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    window.OpenSubmitFeedback.invoke()
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error...{error.message}</div>
  }

  return (
    <div className="flex flex-col items-center mb-4 space-y-1">
      <button
        onClick={e => openSubmitFeedback(e)}
        title="Submit Feedback - opens in a browser"
        type="button"
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <EnvelopeIcon className="h-5 w-5 mr-2" />
        Submit Feedback
      </button>
      <p className="text-center text-gray-300 font-mono">
        version {data.meta.appVersion || 'unknown'}
      </p>
    </div>
  )
}
