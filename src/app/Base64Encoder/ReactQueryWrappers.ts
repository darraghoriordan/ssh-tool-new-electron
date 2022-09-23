import { useMutation } from '@tanstack/react-query'
import {
  Base64EncoderMessage,
  Base64EncoderResponse,
} from '../../electron/base64Encoder/channels/MessageTypes'

export const wellKnownQueries = {
  escapeJson: 'escape-json',
}
export function useEncodeBase64() {
  return useMutation<
    Base64EncoderResponse,
    { message: string },
    Base64EncoderMessage,
    unknown
  >(
    [wellKnownQueries.escapeJson],
    async variables => {
      return window.Base64Encoder.invoke(variables)
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Base 64 encoding completed successfully.')
      },
    }
  )
}
