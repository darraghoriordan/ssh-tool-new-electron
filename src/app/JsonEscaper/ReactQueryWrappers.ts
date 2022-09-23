import { useMutation } from '@tanstack/react-query'
import {
  EscapeJsonMessage,
  EscapeJsonResponse,
} from '../../electron/jsonEncoder/channels/MessageTypes'

export const wellKnownQueries = {
  escapeJson: 'escape-json',
}
export function useEscapeJson() {
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
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Json escaping completed successfully.')
      },
    }
  )
}
