import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router'

const EmptyList = () => {
  const navigateRoute = useNavigate()
  return (
    <>
      <button
        type="button"
        onClick={e => {
          e.preventDefault()
          // go to new url
          navigateRoute('/settings')
        }}
        className="relative block w-full p-12 mt-8 text-center border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <Cog6ToothIcon
          className={'block mx-auto h-40 w-40'}
          aria-hidden="true"
        />

        <span className="block mt-2 text-sm font-medium text-gray-900">
          No Git configuration files found. <br />
          Click here to go to the App Settings screen and verify the Git project
          paths.
        </span>
        <span className="block mt-8 text-sm font-medium text-gray-900">
          When you&apos;re done, return here and click on the rescan button.
        </span>
      </button>
    </>
  )
}
export default EmptyList
