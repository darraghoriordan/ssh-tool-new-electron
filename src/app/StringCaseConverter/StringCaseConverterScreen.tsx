/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { StringCases } from '../../electron/stringCase/channels/MessageTypes'
import { useStringCaseConverter } from './ReactQueryWrappers'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'

export function StringCaseConverterScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const runMutation = useStringCaseConverter()
  const [inputValue, setInputValue] = useState('')
  const [caseMethod, setCaseMethod] = useState(StringCases.lower)
  const [outputValue, setOutputValue] = useState('')

  let control: ReactElement | undefined = undefined
  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      data: inputValue,
      toCase: caseMethod,
    }

    if (!input.data) {
      logAMessage({
        level: 'error',
        message: 'You must enter some data to convert',
      })

      return
    }

    const result = await runMutation.mutateAsync(input)
    setOutputValue(result.result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue(
      'THIS IS A SAMPLE VALUE\r\nand_another_sample_value\r\none more sample value',
    )
  }

  if (runMutation) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className=" mb-8">
          <label
            htmlFor="toCase"
            className="block text-sm font-medium text-gray-700"
          >
            To Case
          </label>
          <select
            id="toCase"
            name="toCase"
            onChange={e => setCaseMethod(e.target.value as StringCases)}
            className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={StringCases.lower}
          >
            <option>{StringCases.camel}</option>
            <option>{StringCases.capital}</option>
            <option>{StringCases.constant}</option>
            <option>{StringCases.header}</option>
            <option>{StringCases.kebab}</option>
            <option>{StringCases.lower}</option>
            <option>{StringCases.pascal}</option>
            <option>{StringCases.sentence}</option>
            <option>{StringCases.snake}</option>
            <option>{StringCases.title}</option>
            <option>{StringCases.upper}</option>
          </select>
        </div>
        <textarea
          rows={6}
          name="data"
          id="data"
          onChange={e => setInputValue(e.target.value)}
          placeholder="Paste your content here. New lines will be treated as separator."
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
      <PageHeader pageTitle={'String Case Converter'}>
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

      {control}
    </ScreenWrapper>
  )
}
