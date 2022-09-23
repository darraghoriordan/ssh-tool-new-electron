/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { useDecodeJwt } from './ReactQueryWrappers'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'

export function JwtDecoderScreen() {
  const decodeJwtMutation = useDecodeJwt()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState('')

  let control: ReactElement | undefined = undefined
  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!inputValue || inputValue.split('.').length !== 3) {
      setOutputValue('Invalid JWT')
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
  if (decodeJwtMutation.isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control = <>Error...{decodeJwtMutation.error.message}</>
  }

  if (decodeJwtMutation && !decodeJwtMutation.isError) {
    control = (
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <textarea
          rows={4}
          name="rawJwt"
          id="rawJwt"
          onChange={e => setInputValue(e.target.value)}
          placeholder="paste your JWT here"
          className="mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          defaultValue={''}
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
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={outputValue}
        />
      </div>
    )
  }
  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'JWT Decoder'}>
        <button
          type="button"
          onClick={e => onDecodeClick(e)}
          disabled={decodeJwtMutation.isLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="h-5 w-5 mr-2 " />
          Decode
        </button>
      </PageHeader>

      {control}
    </div>
  )
}
