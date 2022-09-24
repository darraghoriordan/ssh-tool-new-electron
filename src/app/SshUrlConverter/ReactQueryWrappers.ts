import { useMutation } from '@tanstack/react-query'
import {
  SshUrlConverterChannelResponse,
  SshUrlConverterChannelMessage,
} from '../../electron/sshConfigFile/channels/MessageTypes'

export const wellKnownQueries = {
  convertSshUrl: 'convert-ssh-url',
}
export function useConvertSshUrl() {
  return useMutation<
    SshUrlConverterChannelResponse,
    { message: string },
    SshUrlConverterChannelMessage,
    unknown
  >(
    [wellKnownQueries.convertSshUrl],
    async variables => {
      return window.SshUrlConverter.invoke(variables)
    },
    {
      onError: error => {
        console.log(error.message)
      },
      onSuccess: () => {
        console.log('Url conversion completed successfully.')
      },
    }
  )
}
