import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  StringSorterMessage,
  StringSorterResponse,
} from '../../electron/stringSorter/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  stringSort: 'string-sort',
}
export function useStringSort() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useMutation<
    StringSorterResponse,
    { message: string },
    StringSorterMessage,
    unknown
  >(
    [wellKnownQueries.stringSort],
    async variables => {
      return window.StringSorter.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.stringSort} tool completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
