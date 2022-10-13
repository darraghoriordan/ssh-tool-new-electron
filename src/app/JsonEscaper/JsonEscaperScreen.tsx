/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useEscapeJson } from './ReactQueryWrappers'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export function JsonEscaperScreen() {
  const escapeJsonMutation = useEscapeJson()
  const [inputValue, setInputValue] = useState('')
  const [unescapeToggleValue, setUnescapeToggleValue] = useState(true)
  const [outputValue, setOutputValue] = useState('')
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  let control: ReactElement | undefined = undefined
  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      data: inputValue,
      unescape: unescapeToggleValue,
    }

    if (!input.data) {
      logAMessage({ message: 'You must enter some content', level: 'error' })
      setOutputValue('You must enter some content')
      return
    }

    const result = await escapeJsonMutation.mutateAsync(input)

    setOutputValue(result.result)
  }

  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue(
      // eslint-disable-next-line no-useless-escape
      // prettier-ignore
      `{\\"this\\":\\"isescaped\\"}`
    )
  }

  if (escapeJsonMutation && !escapeJsonMutation.isError) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className=" mb-8">
          <label
            htmlFor="escaping"
            className="text-base font-medium text-gray-900"
          >
            Escape or Unescape
          </label>
          <p className="text-sm text-gray-500 leading-5">
            Are you escaping or unescaping your json?
          </p>
          <fieldset className="mt-4">
            <legend className="sr-only">Escaping or unescaping method</legend>
            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
              <div key="escaping" className="flex items-center">
                <input
                  id="escaping"
                  name="escaping-method"
                  type="radio"
                  onChange={e =>
                    setUnescapeToggleValue(e.currentTarget.id === 'unescape')
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="escaping"
                  className="block ml-3 text-sm font-medium text-gray-700"
                >
                  Escape
                </label>
              </div>
              <div key="unescape" className="flex items-center">
                <input
                  id="unescape"
                  name="escaping-method"
                  defaultChecked={true}
                  onChange={e =>
                    setUnescapeToggleValue(e.currentTarget.id === 'unescape')
                  }
                  type="radio"
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <label
                  htmlFor="unescape"
                  className="block ml-3 text-sm font-medium text-gray-700"
                >
                  Unescape
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <textarea
          rows={4}
          name="data"
          id="data"
          onChange={e => setInputValue(e.target.value)}
          placeholder="Paste your JSON content here and press Submit"
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
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'Json Escaper'}>
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
          disabled={escapeJsonMutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Submit
        </button>
      </PageHeader>

      {control}
    </div>
  )
}
