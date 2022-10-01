/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useEncodeBase64 } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export function Base64EncoderScreen() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const encodeBase64Mutation = useEncodeBase64()
  const [inputValue, setInputValue] = useState('')
  const [encodeToggleValue, setEncodeToggleValue] = useState(false)
  const [outputValue, setOutputValue] = useState('')

  let control: ReactElement | undefined = undefined
  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      data: inputValue,
      encode: encodeToggleValue,
    }

    if (!input.data) {
      logAMessage({
        level: 'error',
        message: 'You must enter some data to encode or decode',
      })

      return
    }

    const result = await encodeBase64Mutation.mutateAsync(input)
    setOutputValue(result.result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('VGhpcyBpcyBhbiBlbmNvZGVkIHNlbnRlbmNlLg==')
  }

  if (encodeBase64Mutation) {
    control = (
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className=" mb-8">
          <label className="text-base font-medium text-gray-900">
            Encode or Decode
          </label>
          <p className="text-sm leading-5 text-gray-500">
            Are you encoding or decoding base64?
          </p>
          <fieldset className="mt-4">
            <legend className="sr-only">Encoding or decoding method</legend>
            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
              <div key="encoding" className="flex items-center">
                <input
                  id="encoding"
                  name="encoding-method"
                  type="radio"
                  onChange={e =>
                    setEncodeToggleValue(e.currentTarget.id === 'encoding')
                  }
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="encoding"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Encode
                </label>
              </div>
              <div key="decode" className="flex items-center">
                <input
                  id="decode"
                  name="encoding-method"
                  defaultChecked={true}
                  onChange={e =>
                    setEncodeToggleValue(e.currentTarget.id === 'encoding')
                  }
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="decode"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Decode
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
          placeholder="Paste your content here"
          className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={outputValue}
        />
      </div>
    )
  }
  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Base64 Encoder'}>
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
          onClick={e => onDecodeClick(e)}
          disabled={encodeBase64Mutation.isLoading}
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
