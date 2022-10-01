import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  DecodeJwtMessage,
  DecodeJwtResponse,
} from '../../electron/jwtDecoder/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  decodeJwt: 'decode-jwt',
}
export function useDecodeJwt() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  return useMutation<
    DecodeJwtResponse,
    { message: string },
    DecodeJwtMessage,
    unknown
  >(
    [wellKnownQueries.decodeJwt],
    async variables => {
      return window.DecodeJwt.invoke({ jwt: variables.jwt })
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.decodeJwt} completed successfully.`,
          level: 'info',
        })
      },
    }
  )
}
