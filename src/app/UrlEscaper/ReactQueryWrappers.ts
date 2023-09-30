import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  UrlEncoderMessage,
  UrlEncoderResponse,
} from '../../electron/urlEncoder/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  urlEncode: 'url-encode',
}
export function useUrlEncoder() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useMutation<
    UrlEncoderResponse,
    { message: string },
    UrlEncoderMessage,
    unknown
  >(
    [wellKnownQueries.urlEncode],
    async variables => {
      return window.UrlEncoder.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.urlEncode} tool completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
