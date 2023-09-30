import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'

import {
  StringCaseMessage,
  StringCaseResponse,
} from '../../electron/stringCase/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  stringCase: 'string-case',
}
export function useStringCaseConverter() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  return useMutation<
    StringCaseResponse,
    { message: string },
    StringCaseMessage,
    unknown
  >(
    [wellKnownQueries.stringCase],
    async variables => {
      return window.StringCase.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.stringCase} tool completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
