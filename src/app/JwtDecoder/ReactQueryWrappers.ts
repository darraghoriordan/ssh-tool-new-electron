import { useMutation } from '@tanstack/react-query'
import {
  DecodeJwtMessage,
  DecodeJwtResponse,
} from '../../electron/jwtDecoder/channels/MessageTypes'

export const wellKnownQueries = {
  decodeJwt: 'decode-jwt',
}
export function useDecodeJwt() {
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
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Jwt decoded successfully.')
      },
    }
  )
}
