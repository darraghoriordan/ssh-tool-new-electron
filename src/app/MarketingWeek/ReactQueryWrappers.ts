import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { GitActivityForMonthResponse } from '../../electron/marketingWeek/channels/MessageTypes'
import { format, isToday } from 'date-fns'

export const wellKnownQueries = {
  getSingleDay: 'get-single-day',
  getGitCommitActivityForMonth: 'get-git-commit-activity-for-month',
}
export function useDevHistoryGetDay({ date }: { date: Date }) {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useQuery(
    [wellKnownQueries.getSingleDay, date.toISOString()],
    async () => {
      logAMessage({
        message: `Started analyising ${format(
          date,
          'yyyy-MM-dd',
        )} Please wait for processing to finish! 🤖 We're crunching your data and setting GPUs on fire 🔥🔥.  It could take 3-4 minutes or more to pass an entire day through AI! Honestly, get yourself a coffee ☕`,
        level: 'info',
      })
      return window.GetDevHistorySingleDay.invoke({
        date: date,
      })
    },

    {
      // never invalidate
      staleTime: isToday(date) ? 5 : Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.getSingleDay} (${format(
            date,
            'yyyy-MM-dd',
          )}) completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}

export function useGitActivityGetMonth({
  startDate,
  endDate,
}: {
  startDate: Date | undefined
  endDate: Date | undefined
}) {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useQuery(
    [wellKnownQueries.getGitCommitActivityForMonth, startDate, endDate],
    async () => {
      if (!startDate || !endDate) {
        return {
          activity: new Map<number, boolean>(),
        } as GitActivityForMonthResponse
      }
      return window.GitActivityForMonth.invoke({
        startDate,
        endDate,
      })
    },

    {
      // never invalidate
      staleTime: Infinity,
      retry: 0,
      refetchOnWindowFocus: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        logAMessage({ message: error.message, level: 'error' })
      },

      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.getGitCommitActivityForMonth} completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
