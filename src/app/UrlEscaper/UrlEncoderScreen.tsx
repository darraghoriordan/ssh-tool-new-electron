/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useUrlEncoder } from './ReactQueryWrappers'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'

const faqs = [
  {
    id: 1,
    question: 'What is this tool for?',
    answer: 'This tool is for encoding and decoding URLs.',
  },
  {
    id: 2,
    question: 'Whats the difference between encoding a uri and component?',
    answer:
      'Encoding a URI will not encode special url characters like /, ?, =, etc. Encoding a component will encode those characters so that you could encode a url to pass as a query string parameter.',
  },
]

export function UrlEncoderScreen() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const runMutation = useUrlEncoder()
  const [inputValue, setInputValue] = useState('')
  const [encodeToggleValue, setEncodeToggleValue] = useState(true)
  const [encodeComponentToggleValue, setEncodeComponentToggleValue] =
    useState(false)
  const [outputValue, setOutputValue] = useState('')

  let control: ReactElement | undefined = undefined
  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      data: inputValue,
      encode: encodeToggleValue,
      component: encodeComponentToggleValue,
    }

    if (!input.data) {
      logAMessage({
        level: 'error',
        message: 'You must enter some data to encode or decode',
      })

      return
    }

    const result = await runMutation.mutateAsync(input)
    setOutputValue(result.result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('https://www.google.com/search?q=hello+wo rld')
  }

  if (runMutation) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className="flex flex-wrap justify-start space-x-6">
          <div className=" mb-8">
            <label
              htmlFor="encoding"
              className="text-base font-medium text-gray-900"
            >
              Encode or Decode
            </label>
            <p className="text-sm text-gray-500 leading-5">
              Are you encoding or decoding?
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Encoding or decoding method</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div key="encoding" className="flex items-center">
                  <input
                    id="encoding"
                    name="encoding-method"
                    type="radio"
                    defaultChecked={true}
                    onChange={e =>
                      setEncodeToggleValue(e.currentTarget.id === 'encoding')
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="encoding"
                    className="block ml-3 text-sm font-medium text-gray-700"
                  >
                    Encode
                  </label>
                </div>
                <div key="decode" className="flex items-center">
                  <input
                    id="decode"
                    name="encoding-method"
                    onChange={e =>
                      setEncodeToggleValue(e.currentTarget.id === 'encoding')
                    }
                    type="radio"
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="decode"
                    className="block ml-3 text-sm font-medium text-gray-700"
                  >
                    Decode
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
          <div className=" mb-8">
            <label
              htmlFor="component-method"
              className="text-base font-medium text-gray-900"
            >
              Uri or Component
            </label>
            <p className="text-sm text-gray-500 leading-5">
              Are you encoding a uri or the value of a query string param?
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Encode for a component</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div key="forUri" className="flex items-center">
                  <input
                    id="forUri"
                    name="component-method"
                    defaultChecked={true}
                    onChange={e =>
                      setEncodeComponentToggleValue(
                        e.currentTarget.id === 'forComponent'
                      )
                    }
                    type="radio"
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="forUri"
                    className="block ml-3 text-sm font-medium text-gray-700"
                  >
                    A Uri
                  </label>
                </div>
                <div key="forComponent" className="flex items-center">
                  <input
                    id="forComponent"
                    name="component-method"
                    type="radio"
                    onChange={e =>
                      setEncodeComponentToggleValue(
                        e.currentTarget.id === 'forComponent'
                      )
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="forComponent"
                    className="block ml-3 text-sm font-medium text-gray-700"
                  >
                    For Query Component
                  </label>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <textarea
          rows={4}
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
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'Uri Encoder'}>
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
          disabled={runMutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Submit
        </button>
      </PageHeader>
      <DescriptionAndHelp faqs={faqs} />
      {control}
    </div>
  )
}
