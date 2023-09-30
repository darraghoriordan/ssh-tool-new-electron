import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  EscapeJsonMessage,
  EscapeJsonResponse,
} from '../../electron/jsonEncoder/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  escapeJson: 'escape-json',
}
export function useEscapeJson() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<
    EscapeJsonResponse,
    { message: string },
    EscapeJsonMessage,
    unknown
  >(
    [wellKnownQueries.escapeJson],
    async variables => {
      return window.EscapeJson.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.escapeJson} completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
