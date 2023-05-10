import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  UnixTimeConverterMessage,
  UnixTimeConverterResponse,
} from '../../electron/unixTimeConverter/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  getLocale: 'get-system-locale',
}

export function useGetSystemLocale() {
  return useQuery([wellKnownQueries.getLocale], async () => {
    return window.CurrentLocale.invoke()
  })
}
