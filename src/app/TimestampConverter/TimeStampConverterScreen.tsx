/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useTimestampConverter } from './ReactQueryWrappers'
import { UnixTimeConverterResponse } from '../../electron/unixTimeConverter/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export function TimestampConverterScreen() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const mutation = useTimestampConverter()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState({
    differenceFromNow: '',
    isoDate: '',
    localeDate: '',
    utcDate: '',
  } as UnixTimeConverterResponse)

  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!inputValue || inputValue.length < 4) {
      // there is a regex on the "backend"
      logAMessage({
        message: 'You must enter a unix timestamp or an ISO timestamp',
        level: 'error',
      })
      setOutputValue({
        differenceFromNow: 'Invalid input',
        isoDate: 'Invalid input',
        localeDate: 'Invalid input',
        unixTimestamp: 0,
        utcDate: 'Invalid input',
      })
      return
    }

    const result = await mutation.mutateAsync({
      unixTimestamp: inputValue,
    })
    setOutputValue(result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('1663944991')
  }

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Timestamp converter'}>
        <button
          onClick={e => insertSampleValue(e)}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Try with sample data
        </button>
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

      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="mb-8">
          <label
            htmlFor="data"
            className="block text-sm font-medium text-gray-700"
          >
            Enter a timestamp - ISO8601 or Unix format
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              name="data"
              id="data"
              onChange={e => setInputValue(e.target.value)}
              placeholder="Unix or ISO timestamp"
              className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={inputValue}
            />
          </div>
        </div>
        <p className="block text-sm font-medium text-gray-700 mb-4">Result</p>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                UTC time, ISO date format
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.utcDate}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Local time, ISO date format
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.isoDate}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Local time, Locale date format
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.localeDate}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Unix timestamp
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {outputValue.unixTimestamp}
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
    </div>
  )
}
