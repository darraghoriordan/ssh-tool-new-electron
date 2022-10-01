import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  Base64EncoderMessage,
  Base64EncoderResponse,
} from '../../electron/base64Encoder/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  base64encode: 'base-64-encode',
}
export function useEncodeBase64() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  return useMutation<
    Base64EncoderResponse,
    { message: string },
    Base64EncoderMessage,
    unknown
  >(
    [wellKnownQueries.base64encode],
    async variables => {
      return window.Base64Encoder.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.base64encode} tool completed successfully.`,
          level: 'info',
        })
      },
    }
  )
}
