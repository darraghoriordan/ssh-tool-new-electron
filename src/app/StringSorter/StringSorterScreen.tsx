/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useStringSort } from './ReactQueryWrappers'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { useGetSystemLocale } from '../TimestampConverter/useGetCurrentLocale'
import LocaleSelector from '../TimestampConverter/LocaleSelector'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'

const faqs = [
  {
    id: 1,
    question: 'What is this tool for?',
    answer:
      'This tool will sort a list of strings but unlike a simple "a > b" sort, it will respect your locale.',
  },
  {
    id: 2,
    question: 'What is the delimiter?',
    answer:
      'This tool uses line breaks as the delimiter. It will detect both Windows and Unix/Mac line breaks.',
  },
]

export function StringSorterScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const runMutation = useStringSort()
  const [inputValue, setInputValue] = useState('')
  const [sortAsc, setSortAscValue] = useState(true)
  const [outputValue, setOutputValue] = useState('')
  const { data: systemLocale } = useGetSystemLocale()
  const [selectedLocale, setSelectedLocale] = useState(systemLocale || 'en-US')

  let control: ReactElement | undefined = undefined
  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      data: inputValue,
      asc: sortAsc,
      locale: selectedLocale,
    }

    if (!input.data) {
      logAMessage({
        level: 'error',
        message: 'You must enter some data to sort',
      })

      return
    }

    const result = await runMutation.mutateAsync(input)
    setOutputValue(result.result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('aaa\r\nccc\r\näää\r\nbbb\r\n333\r\n111\r\n')
  }

  if (runMutation) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className=" mb-8">
          <label
            htmlFor="ascOrDesc"
            className="text-base font-medium text-gray-900"
          >
            Asc or Desc
          </label>
          <p className="text-sm text-gray-500 leading-5">
            Sort ascending or descending?
          </p>
          <fieldset className="mt-4">
            <legend className="sr-only">Sort ascending or descending</legend>
            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
              <div key="asc" className="flex items-center">
                <input
                  id="asc"
                  name="asc-method"
                  type="radio"
                  defaultChecked={true}
                  onChange={e => setSortAscValue(e.currentTarget.id === 'asc')}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="asc"
                  className="block ml-3 text-sm font-medium text-gray-700"
                >
                  Ascending
                </label>
              </div>
              <div key="desc" className="flex items-center">
                <input
                  id="desc"
                  name="asc-method"
                  onChange={e => setSortAscValue(e.currentTarget.id === 'asc')}
                  type="radio"
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="desc"
                  className="block ml-3 text-sm font-medium text-gray-700"
                >
                  Descending
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="flex flex-col mt-8 mb-8 space-y-3">
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
        <textarea
          rows={6}
          name="data"
          id="data"
          onChange={e => setInputValue(e.target.value)}
          placeholder="Paste your content here"
          className="block w-full mb-4 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={inputValue}
        />
        <label
          htmlFor="decoded"
          className="block text-sm font-medium text-gray-700"
        >
          Output
        </label>
        <textarea
          rows={16}
          name="decoded"
          disabled={true}
          id="decoded"
          placeholder="Click the submit button"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={outputValue}
        />
      </div>
    )
  }
  return (
    <ScreenWrapper>
      <PageHeader pageTitle={'String Sort'}>
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
          onClick={e => onDecodeClick(e)}
          disabled={runMutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Submit
        </button>
      </PageHeader>
      <DescriptionAndHelp faqs={faqs} />
      {control}
    </ScreenWrapper>
  )
}
