/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { ArrowDownIcon, DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useEncodeHtmlCharacter } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { HtmlEncoderType } from '../../electron/htmlEncoder/HtmlEncoderService'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'

export function HtmlEncoderScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const encodeHtmlMutation = useEncodeHtmlCharacter()
  const [inputValue, setInputValue] = useState('')
  const [encodeToggleValue, setEncodeToggleValue] = useState(true)
  const [encodeTypeValue, setEncodeTypeValue] =
    useState<HtmlEncoderType>('html-entity')
  const [outputValue, setOutputValue] = useState('')

  let control: ReactElement | undefined = undefined
  const onDecodeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    return runAction()
  }

  const runAction = async () => {
    const input = {
      data: inputValue,
      encode: encodeToggleValue,
      type: encodeTypeValue,
    }

    if (!input.data) {
      logAMessage({
        level: 'error',
        message: 'You must enter some data to encode or decode',
      })

      return
    }

    const result = await encodeHtmlMutation.mutateAsync(input)
    setOutputValue(result.result)
  }
  const handleInputKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter') {
      return runAction()
    }
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('Should encode < and >')
  }

  if (encodeHtmlMutation) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className="flex flex-wrap justify-start space-x-16">
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
                    defaultChecked={true}
                    type="radio"
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
              htmlFor="encoding"
              className="text-base font-medium text-gray-900"
            >
              Html Entity or Unicode
            </label>
            <p className="text-sm text-gray-500 leading-5">
              {encodeToggleValue ? 'Do you want to output' : 'Is your input'}{' '}
              Html Entity or Unicode ?
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Choose the type of input data</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                <div key="html-entity" className="flex items-center">
                  <input
                    id="html-entity"
                    name="encoding-type"
                    type="radio"
                    defaultChecked={true}
                    onChange={e =>
                      setEncodeTypeValue(e.currentTarget.id as HtmlEncoderType)
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="html-entity"
                    className="block ml-3 text-sm font-medium text-gray-700"
                  >
                    Html Entity (<pre className="inline">&abcd;</pre>)
                  </label>
                </div>
                <div key="unicode" className="flex items-center">
                  <input
                    id="unicode"
                    name="encoding-type"
                    onChange={e =>
                      setEncodeTypeValue(e.currentTarget.id as HtmlEncoderType)
                    }
                    type="radio"
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="unicode"
                    className="block ml-3 text-sm font-medium text-gray-700"
                  >
                    Unicode (<pre className="inline">\u1234</pre>)
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
          onKeyDown={handleInputKeyDown}
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
      <PageHeader pageTitle={'Html Char Encoder'}>
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
          disabled={encodeHtmlMutation.isLoading}
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
