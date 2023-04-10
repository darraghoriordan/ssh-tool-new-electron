import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import {
  HtmlEncoderMessage,
  HtmlEncoderResponse,
} from '../../electron/htmlEncoder/channels/MessageTypes'

export const wellKnownQueries = {
  htmlEncode: 'html-encode',
}
export function useEncodeHtmlCharacter() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  return useMutation<
    HtmlEncoderResponse,
    { message: string },
    HtmlEncoderMessage,
    unknown
  >(
    [wellKnownQueries.htmlEncode],
    async variables => {
      return window.HtmlEncoder.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.htmlEncode} tool completed successfully.`,
          level: 'info',
        })
      },
    }
  )
}
