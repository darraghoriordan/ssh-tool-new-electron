import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import {
  DevHistoryDayResponse,
  DevHistoryGetDayRequest,
} from '../../electron/devHistory/channels/MessageTypes'

export const wellKnownQueries = {
  getSingleDay: 'get-single-day',
}
export function useDevHistoryGetDay() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useMutation<
    DevHistoryDayResponse,
    { message: string },
    DevHistoryGetDayRequest,
    unknown
  >(
    [wellKnownQueries.getSingleDay],
    async variables => {
      return window.GetDevHistorySingleDay.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.getSingleDay} tool completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
