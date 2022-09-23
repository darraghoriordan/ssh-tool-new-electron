/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useUnixTimeConverter } from './ReactQueryWrappers'
import { UnixTimeConverterResponse } from '../../electron/unixTimeConverter/channels/MessageTypes'

export function UnixTimeConverterScreen() {
  const mutation = useUnixTimeConverter()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState({
    differenceFromNow: '',
    isoDate: '',
    localeDate: '',
    utcDate: '',
  } as UnixTimeConverterResponse)

  let control: ReactElement | undefined = undefined
  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      unixTimestamp: inputValue,
    }
    console.log('input', input)

    if (!input.unixTimestamp) {
      setOutputValue({
        differenceFromNow: 'Invalid input',
        isoDate: 'Invalid input',
        localeDate: 'Invalid input',
        utcDate: 'Invalid input',
      })
      return
    }

    const result = await mutation.mutateAsync(input)
    console.log(result)
    setOutputValue(result)
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
            Enter a Unix timestamp
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              name="data"
              id="data"
              onChange={e => setInputValue(e.target.value)}
              placeholder="Unix timestamp"
              className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              defaultValue={''}
            />
          </div>
        </div>
        <p className="block text-sm font-medium text-gray-700 mb-4">Result</p>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                UTC time, ISO Date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.utcDate}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Local time, ISO date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.isoDate}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Local time, Locale date
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.localeDate}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Difference from now
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.differenceFromNow}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Unix timestamp converter'}>
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
