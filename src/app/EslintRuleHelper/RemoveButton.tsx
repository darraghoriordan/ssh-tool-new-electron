import { TrashIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

export const RemoveButton = ({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      type="button"
      className={clsx(
        className,
        'inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
      )}
      onClick={onClick}
    >
      <TrashIcon className="w-3 h-3 mr-1" /> Remove
    </button>
  )
}
