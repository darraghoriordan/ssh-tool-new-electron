/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useTimestampConverter } from './ReactQueryWrappers'
import { UnixTimeConverterResponse } from '../../electron/unixTimeConverter/channels/MessageTypes'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import LocaleSelector from './LocaleSelector'
import { useGetSystemLocale } from './useGetCurrentLocale'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'

export function TimestampConverterScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const mutation = useTimestampConverter()
  const [inputValue, setInputValue] = useState('')
  const { data: systemLocale } = useGetSystemLocale()
  const [selectedLocale, setSelectedLocale] = useState(systemLocale || 'en-US')
  const [outputValue, setOutputValue] = useState({
    differenceFromNow: '',
    isoDate: '',
    localeDate: '',
    utcDate: '',
  } as UnixTimeConverterResponse)
  const handleInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      return runAction()
    }
  }
  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    return runAction()
  }
  const runAction = async () => {
    if (!inputValue || inputValue.length < 4) {
      // there is a regex on the "backend" to validate
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
      locale: selectedLocale,
    })
    setOutputValue(result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('1663944991')
  }

  return (
    <ScreenWrapper>
      <PageHeader pageTitle={'Timestamp converter'}>
        <button
          onClick={e => insertSampleValue(e)}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="w-5 h-5 mr-2" />
          Try with sample data
        </button>
        <button
          type="button"
          onClick={e => onSubmitClick(e)}
          disabled={mutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Submit
        </button>
      </PageHeader>

      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className="mb-8">
          <div className="flex mt-1 rounded-md shadow-sm">
            <input
              name="data"
              id="data"
              onKeyDown={handleInputKeyDown}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter a timestamp - ISO8601 or Unix format - and press enter/submit"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={inputValue}
            />
          </div>
          <div className="flex flex-col mt-6 space-y-3">
            <label
              htmlFor="locale"
              className="block text-sm font-medium text-gray-700"
            >
              Choose Locale
            </label>
            <div className="">
              {systemLocale && (
                <LocaleSelector
                  defaultValue={systemLocale}
                  setSelectedLocale={setSelectedLocale}
                />
              )}
            </div>
          </div>
        </div>
        <p className="block mb-4 text-sm font-medium text-gray-700">Result</p>
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
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
    </ScreenWrapper>
  )
}
