import { CommandLineIcon } from '@heroicons/react/24/outline'

import React, { useContext, useEffect } from 'react'
import { ConsoleContext } from './ConsoleContext'

export type ConsoleLogMessage = {
  level: 'info' | 'warn' | 'error'
  message: string
}

export const Console = () => {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const consoleScrollRef = React.createRef<HTMLDivElement>()

  useEffect(() => {
    consoleScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logMessages])

  return (
    <>
      <div className="text-white bg-neutral-800 border-neutral-600 border-t-2 w-100 border-b-2 pl-4 flex items-center">
        <CommandLineIcon className="h-4 w-4 text-white" aria-hidden="true" />
        <span className="font-mono ml-2">console</span>
      </div>
      <div className="bg-neutral-800 h-1/5 overflow-auto w-full">
        <div
          className="font-mono pl-4 pt-1 text-sm whitespace-pre align-top"
          aria-readonly={true}
          aria-label="message console"
        >
          {logMessages.map((x, i) => {
            const message = `[${x.level.toUpperCase()}] $> ${x.message}`

            switch (x.level) {
              case 'error':
                return (
                  <code key={i} className="text-red-600">
                    {message}
                    <br />
                  </code>
                )

              case 'warn':
                return (
                  <code key={i} className="text-orange-400">
                    {message}
                    <br />
                  </code>
                )
              default:
                return (
                  <code key={i} className="text-white">
                    {message}
                    <br />
                  </code>
                )
            }
          })}
          <div ref={consoleScrollRef} />
        </div>
      </div>{' '}
    </>
  )
}
