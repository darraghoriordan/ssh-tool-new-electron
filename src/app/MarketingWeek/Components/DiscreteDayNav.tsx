import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import isToday from 'date-fns/isToday'

export function DiscreteDayNav({
  date,
  setSelectedDate,
}: {
  date: Date
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
}) {
  return (
    <div className="relative flex items-center bg-white rounded-md shadow-sm md:items-stretch">
      <button
        type="button"
        onClick={() => {
          const newDate = new Date(date)
          newDate.setDate(newDate.getDate() - 1)
          setSelectedDate(newDate)
        }}
        className="flex items-center justify-center w-12 pr-1 text-gray-400 border-l border-gray-300 h-9 rounded-l-md border-y hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
      >
        <span className="sr-only">Previous day</span>
        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hidden text-sm font-semibold text-gray-900 border-gray-300 border-y px-3.5 hover:bg-gray-50 focus:relative md:block"
      >
        {isToday(date) ? 'Today' : date.toLocaleDateString()}
      </button>
      <span className="relative w-px h-5 -mx-px bg-gray-300 md:hidden" />
      <button
        disabled={isToday(date)}
        type="button"
        onClick={() => {
          const newDate = new Date(date)
          newDate.setDate(newDate.getDate() + 1)
          setSelectedDate(newDate)
        }}
        className={clsx(
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center w-12 pl-1 text-gray-400 border-r border-gray-300 h-9 rounded-r-md border-y hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50',
        )}
      >
        <span className="sr-only">Next day</span>
        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  )
}
