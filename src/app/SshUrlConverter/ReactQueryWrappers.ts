import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import {
  SshUrlConverterChannelResponse,
  SshUrlConverterChannelMessage,
} from '../../electron/sshConfigFile/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export const wellKnownQueries = {
  convertSshUrl: 'convert-ssh-url',
}
export function useConvertSshUrl() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

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
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.convertSshUrl} completed successfully.`,
          level: 'info',
        })
      },
    },
  )
}
