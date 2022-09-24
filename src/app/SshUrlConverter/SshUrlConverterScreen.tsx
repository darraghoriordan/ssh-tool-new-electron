/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useConvertSshUrl } from './ReactQueryWrappers'
import { SshConverterResults } from '../../electron/sshConfigFile/models/SshConverterResults'

export function SshUrlConverterScreen() {
  const mutation = useConvertSshUrl()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState<
    SshConverterResults | undefined
  >(undefined)

  let control: ReactElement | undefined = undefined
  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      gitUrl: inputValue,
    }
    console.log('input', input)

    if (!input.gitUrl) {
      // throw an error
    }

    const result = await mutation.mutateAsync(input)
    console.log(result)
    setOutputValue(result.possibleGitUrls)
  }
  if (mutation.isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control = <>Error...{mutation.error.message}</>
  }

  if (mutation && !mutation.isError) {
    control = (
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="mb-8">
          <label
            htmlFor="sshCertPath"
            className="block text-sm font-medium text-gray-700"
          >
            Enter an ssh or http git url
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              name="data"
              id="data"
              onChange={e => setInputValue(e.target.value)}
              placeholder="paste a git url here"
              className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue={''}
            />
          </div>

          <p className="text-sm leading-5 text-gray-500 mt-8">
            http direct url
          </p>
          {outputValue?.httpUrl && (
            <span className="font-mono">git clone {outputValue?.httpUrl}</span>
          )}

          <p className="text-sm leading-5 text-gray-500 mt-4">ssh direct url</p>

          {outputValue?.sshUrl && (
            <span className="font-mono">git clone {outputValue?.sshUrl}</span>
          )}

          {outputValue?.sshAliases.map(x => (
            <>
              <p className="text-sm leading-5 text-gray-500 mt-4">{x.alias}</p>
              <span className="font-mono">git clone {x.url}</span>
            </>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Git SSH Url Converter'}>
        <button
          type="button"
          onClick={e => onSubmitClick(e)}
          disabled={mutation.isLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="h-5 w-5 mr-2 " />
          Submit
        </button>
      </PageHeader>

      {control}
    </div>
  )
}
