import { useMutation } from '@tanstack/react-query'
import {
  UnixTimeConverterMessage,
  UnixTimeConverterResponse,
} from '../../electron/unixTimeConverter/channels/MessageTypes'

export const wellKnownQueries = {
  convertTime: 'convert-time',
}
export function useTimestampConverter() {
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
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Timestamp conversion completed successfully.')
      },
    }
  )
}
