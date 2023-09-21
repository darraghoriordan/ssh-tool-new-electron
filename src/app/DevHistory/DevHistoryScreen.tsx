/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext } from 'react'
import PageHeader from '../components/PageHeader'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'
import { useDevHistoryGetDay } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export function DevHistoryScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)

  const { data, isLoading } = useDevHistoryGetDay({ date: new Date() })

  let control: ReactElement | undefined = undefined
  const onRefreshClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault()
    logAMessage({ message: 'Refresh Clicked', level: 'info' })
  }
  if (!isLoading && data) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
        <div className="flex flex-wrap justify-start space-x-16">
          <pre>{JSON.stringify(data, null)}</pre>
          {data.chromeHistory.map((item, index) => {
            return <p key={index}>{item.title}</p>
          })}
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'History'}>
        <button
          type="button"
          onClick={e => onRefreshClick(e)}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Refresh
        </button>
      </PageHeader>

      {control}
    </div>
  )
}
