import { useMutation } from '@tanstack/react-query'

export const wellKnownQueries = {
  convertSshUrl: 'convert-ssh-url',
}
export function useConvertSshUrl() {
  return useMutation<
    { data: string },
    { message: string },
    { data: string },
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
