import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  UnixTimeConverterMessage,
  UnixTimeConverterResponse,
} from '../../electron/unixTimeConverter/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  convertTime: 'convert-time',
}
export function useTimestampConverter() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<
    UnixTimeConverterResponse,
    { message: string },
    UnixTimeConverterMessage,
    unknown
  >(
    [wellKnownQueries.convertTime],
    async variables => {
      return window.UnixTimeConverter.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.convertTime} completed successfully.`,
          level: 'info',
        })
      },
    }
  )
}
