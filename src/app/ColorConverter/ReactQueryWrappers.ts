import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'

import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import {
  ColorConverterMessage,
  ColorConverterResponse,
} from '../../electron/colorConverter/channels/MessageTypes'

export const wellKnownQueries = {
  convertColor: 'convert-color',
}
export function useColorConverter() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<
    ColorConverterResponse,
    { message: string },
    ColorConverterMessage,
    unknown
  >(
    [wellKnownQueries.convertColor],
    async variables => {
      return window.ColorConverter.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.convertColor} completed successfully.`,
          level: 'info',
        })
      },
    }
  )
}
