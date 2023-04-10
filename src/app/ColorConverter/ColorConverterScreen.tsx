/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
  ArrowDownIcon,
  ClipboardDocumentCheckIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline'
import { useColorConverter } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { ColorConverterResponse } from '../../electron/colorConverter/channels/MessageTypes'
import { ColorDataItem } from './ColorDataItem'
import ColorItem from './ColorItem'
import { HarmonyColorsSet } from './HarmonyColorSet'

export function ColorConverterScreen() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const mutation = useColorConverter()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState<
    ColorConverterResponse | undefined
  >()
  const handleInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
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
      // there is a regex on the "backend"
      logAMessage({
        message: 'You must enter a color value to convert',
        level: 'error',
      })
      setOutputValue(undefined)
      return
    }

    const result = await mutation.mutateAsync({
      color: inputValue,
    })
    setOutputValue(result)
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue('#DD3C3C')
  }
  const clipValue = (value: string) => {
    navigator.clipboard.writeText(value)
    logAMessage({
      message: `Copied to clipboard - ${value}`,
      level: 'info',
    })
  }
  return (
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'Color Tool'}>
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
              placeholder="Enter a color e.g. '#DD3C3C' or 'red' or 'rgb(255, 0, 0)'"
              className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={inputValue}
            />
          </div>
        </div>
        {outputValue && (
          <div className="flex items-center mb-16 space-x-16">
            <ColorItem
              clipColor={outputValue.hex}
              clipValue={clipValue}
              colorValue={outputValue.hex}
              title="Your Color"
            />
            <ColorItem
              clipColor={outputValue.nearestTailwindColor.name}
              clipValue={clipValue}
              colorValue={outputValue.nearestTailwindColor.value}
              title="Nearest Tailwind Color"
            />
          </div>
        )}
        <p className="block mb-4 text-sm font-medium text-gray-700">
          Conversions
        </p>
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <ColorDataItem
              label="Hex"
              value={outputValue?.hex}
              clipValue={clipValue}
            />
            <ColorDataItem
              label="RGB"
              value={outputValue?.rgb}
              clipValue={clipValue}
            />

            <ColorDataItem
              label="CSS Color Name"
              value={outputValue?.name}
              clipValue={clipValue}
            />
            <ColorDataItem
              label="Nearest Tailwind Color"
              value={outputValue?.nearestTailwindColor.name}
              clipValue={clipValue}
            />

            <ColorDataItem
              label="HSL"
              value={outputValue?.hsl}
              clipValue={clipValue}
            />
            <ColorDataItem
              label="CMYK"
              value={outputValue?.cmyk}
              clipValue={clipValue}
            />
            <ColorDataItem
              label="HWB"
              value={outputValue?.hwb}
              clipValue={clipValue}
            />
          </dl>
        </div>
        <p className="block mt-4 mb-4 text-sm font-medium text-gray-700">
          Harmony Colors
        </p>
        {outputValue && (
          <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {Object.keys(outputValue.harmonyColors).map((color, index) => {
                const harmonyInstance =
                  outputValue.harmonyColors[
                    color as keyof typeof outputValue.harmonyColors
                  ]
                return (
                  <HarmonyColorsSet
                    key={index}
                    colors={harmonyInstance}
                    clipValue={clipValue}
                    label={color}
                  />
                )
              })}
            </dl>
          </div>
        )}
      </div>
    </div>
  )
}
