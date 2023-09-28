import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { GitActivityForMonthResponse } from '../../electron/devHistory/channels/MessageTypes'

export const wellKnownQueries = {
  getSingleDay: 'get-single-day',
  getGitCommitActivityForMonth: 'get-git-commit-activity-for-month',
}
export function useDevHistoryGetDay({ date }: { date: Date }) {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useQuery(
    [wellKnownQueries.getSingleDay, date.toISOString()],
    async () => {
      return window.GetDevHistorySingleDay.invoke({
        date: date,
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
          message: `${wellKnownQueries.getSingleDay} completed successfully.`,
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
          message: `${wellKnownQueries.getSingleDay} completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
