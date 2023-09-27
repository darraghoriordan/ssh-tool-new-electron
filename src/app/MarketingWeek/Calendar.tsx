/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { IncrementAnalysis } from '../../electron/devHistory/models/IncrementAnalysis'
import { ScheduledItem } from './Components/ScheduleItem'
import {
  eachDayOfInterval,
  endOfMonth,
  isMonday,
  isSameMonth,
  isSunday,
  isToday,
  nextSunday,
  format,
  previousMonday,
  isSameDay,
  isFuture,
  subMonths,
  addMonths,
} from 'date-fns'

const firstDayOfMonth = new Date(2023, 8, 1)
let nearestMonday = new Date(firstDayOfMonth)
let lastSunday = endOfMonth(nearestMonday)

if (!isMonday(nearestMonday)) {
  nearestMonday = previousMonday(nearestMonday)
}
if (!isSunday(lastSunday)) {
  lastSunday = nextSunday(lastSunday)
}
const newDays = eachDayOfInterval({
  start: nearestMonday,
  end: lastSunday,
})

const days = newDays.map(day => {
  return {
    date: format(day, 'yyyy-MM-dd'),
    jsDate: day,
    isCurrentMonth: isSameMonth(firstDayOfMonth, day),
    isToday: isToday(day),
    isSelected: false,
    isFuture: isFuture(day),
  }
})

const times = [
  '12AM',
  '1AM',
  '2AM',
  '3AM',
  '4AM',
  '5AM',
  '6AM',
  '7AM',
  '8AM',
  '9AM',
  '10AM',
  '11AM',
  '12PM',
  '1PM',
  '2PM',
  '3PM',
  '4PM',
  '5PM',
  '6PM',
  '7PM',
  '8PM',
  '9PM',
  '10PM',
  '11PM',
]

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
export function calculateTimeDegree(inputTime: Date) {
  // Calculate the integer representation within the range [0, 288]
  let integerRepresentation = Math.min(
    Math.max(0, (inputTime.getHours() * 60 + inputTime.getMinutes()) / 5),
    288,
  )

  integerRepresentation = Math.round(integerRepresentation / 2) * 2
  return integerRepresentation
}
export default function Calendar({
  analysis,
  date,
  setSelectedDate,
  setSelectedIncrement,
  setOpenDateActions,
}: {
  analysis: IncrementAnalysis[]
  setSelectedIncrement: React.Dispatch<IncrementAnalysis | undefined>
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
  setOpenDateActions: React.Dispatch<React.SetStateAction<boolean>>
  date: Date
}) {
  const container = useRef<HTMLDivElement | null>(null)
  const containerNav = useRef<HTMLDivElement | null>(null)
  const containerOffset = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60
    if (
      container === null ||
      container.current === null ||
      containerNav === null ||
      containerNav.current === null ||
      containerOffset === null ||
      containerOffset.current === null
    ) {
      return
    }

    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440
  }, [analysis])

  return (
    <div className="flex flex-auto overflow-hidden bg-white isolate">
      <div ref={container} className="flex flex-col flex-auto overflow-auto">
        <div
          ref={containerNav}
          className="sticky top-0 z-10 flex-none text-xs text-gray-500 bg-white shadow grid grid-cols-7 ring-1 ring-black ring-opacity-5 md:hidden"
        >
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>W</span>
            {/* Default: "text-gray-900", Selected: "bg-gray-900 text-white", Today (Not Selected): "text-indigo-600", Today (Selected): "bg-indigo-600 text-white" */}
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-gray-900 rounded-full">
              19
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>T</span>
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-indigo-600 rounded-full">
              20
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>F</span>
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-gray-900 rounded-full">
              21
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>S</span>
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-white bg-gray-900 rounded-full">
              22
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>S</span>
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-gray-900 rounded-full">
              23
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>M</span>
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-gray-900 rounded-full">
              24
            </span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center pt-3 pb-1.5"
          >
            <span>T</span>
            <span className="flex items-center justify-center w-8 h-8 mt-3 text-base font-semibold text-gray-900 rounded-full">
              25
            </span>
          </button>
        </div>
        <div className="flex flex-auto w-full">
          <div className="flex-none bg-white w-14 ring-1 ring-gray-100" />
          <div className="flex-auto grid grid-cols-1 grid-rows-1">
            {/* Horizontal lines */}
            <div
              className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
              style={{ gridTemplateRows: 'repeat(48, minmax(3.5rem, 1fr))' }}
            >
              <div ref={containerOffset} className="row-end-1 h-7"></div>
              {times.map(time => {
                return (
                  <Fragment key={time}>
                    <div>
                      <div className="sticky left-0 pr-2 text-xs text-right text-gray-400 -ml-14 -mt-2.5 w-14 leading-5">
                        {time}
                      </div>
                    </div>
                    <div />
                  </Fragment>
                )
              })}
            </div>

            {/* Events */}
            <ol
              className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
              style={{
                gridTemplateRows: '1.75rem repeat(288, minmax(0, 1fr)) auto',
              }}
            >
              {analysis.map((item, index) => {
                if (!item.raw.analysis?.summary) {
                  return null
                }
                const startDegree = calculateTimeDegree(
                  item.increment.startDate,
                )
                const spanDegree =
                  calculateTimeDegree(item.increment.endDate) - startDegree

                return (
                  <li
                    className="relative flex mt-px"
                    style={{
                      gridRow: `${startDegree + 1} / span ${spanDegree + 1}`,
                    }}
                    key={index}
                  >
                    <ScheduledItem
                      item={item.raw.analysis.summary}
                      onClick={() => {
                        setSelectedIncrement(item)
                        setOpenDateActions(true)
                      }}
                    />
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
      <div className="flex-none hidden w-1/2 max-w-2xl px-8 py-10 border-l border-gray-100 md:block">
        <div className="flex-none max-w-md mx-auto">
          <div className="flex items-center text-center text-gray-900">
            <button
              type="button"
              onClick={() => setSelectedDate(subMonths(date, 1))}
              className="flex items-center justify-center flex-none text-gray-400 -m-1.5 p-1.5 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <div className="flex-auto text-sm font-semibold">
              {format(date, 'MMMM yyyy')}
            </div>
            <button
              type="button"
              disabled={isSameMonth(date, new Date())}
              onClick={() => setSelectedDate(addMonths(date, 1))}
              className="flex items-center justify-center flex-none text-gray-400 -m-1.5 p-1.5 hover:text-gray-500 disabled:opacity-5 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 text-xs text-center text-gray-500 grid grid-cols-7 leading-6">
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
            <div>S</div>
          </div>
          <div className="mt-2 text-sm bg-gray-200 rounded-lg shadow isolate grid grid-cols-7 gap-px ring-1 ring-gray-200">
            {days.map((day, dayIdx) => {
              day.isSelected = isSameDay(day.jsDate, date)
              return (
                <button
                  disabled={day.isFuture}
                  key={day.date}
                  type="button"
                  onClick={() => setSelectedDate(day.jsDate)}
                  className={classNames(
                    'py-1.5 hover:bg-gray-100 focus:z-10',
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                    (day.isSelected || day.isToday) && 'font-semibold',
                    day.isSelected && 'text-white',
                    !day.isSelected &&
                      day.isCurrentMonth &&
                      !day.isToday &&
                      'text-gray-900',
                    !day.isSelected &&
                      !day.isCurrentMonth &&
                      !day.isToday &&
                      'text-gray-400',
                    day.isToday && !day.isSelected && 'text-indigo-600',
                    dayIdx === 0 && 'rounded-tl-lg',
                    dayIdx === 6 && 'rounded-tr-lg',
                    dayIdx === days.length - 7 && 'rounded-bl-lg',
                    dayIdx === days.length - 1 && 'rounded-br-lg',
                    'disabled:opacity-5 disabled:cursor-not-allowed',
                  )}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                      day.isSelected && day.isToday && 'bg-indigo-600',
                      day.isSelected && !day.isToday && 'bg-gray-900',
                    )}
                  >
                    {day?.date?.split('-')?.pop()?.replace(/^0/, '')}
                  </time>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
