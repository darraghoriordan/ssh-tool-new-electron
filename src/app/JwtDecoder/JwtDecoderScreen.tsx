/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useDecodeJwt } from './ReactQueryWrappers'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export function JwtDecoderScreen() {
  const decodeJwtMutation = useDecodeJwt()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!inputValue || inputValue.split('.').length !== 3) {
      logAMessage({ message: 'Invalid JWT detected.', level: 'error' })
      return
    }

    const result = await decodeJwtMutation.mutateAsync({ jwt: inputValue })

    setOutputValue(
      JSON.stringify(
        { header: result.algorithm, payload: result.payload },
        null,
        2
      )
    )
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0.yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw'
    )
  }

  return (
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'JWT Decoder'}>
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
          disabled={decodeJwtMutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Decode
        </button>
      </PageHeader>

      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <textarea
          rows={4}
          name="rawJwt"
          id="rawJwt"
          onChange={e => setInputValue(e.target.value)}
          placeholder="Paste a valid JWT here and press Submit"
          className="block w-full mb-4 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={inputValue}
        />
        <label
          htmlFor="decoded"
          className="block text-sm font-medium text-gray-700"
        >
          Decoded JWT
        </label>

        <textarea
          rows={16}
          name="decoded"
          disabled={true}
          id="decoded"
          placeholder="click the button to decode"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={outputValue}
        />
      </div>
    </div>
  )
}
