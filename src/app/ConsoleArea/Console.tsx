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
    <div className="h-40 bg-neutral-800">
      <div className="flex items-center h-8 text-white border-t-2 border-b-2 bg-neutral-800 border-neutral-600 w-100">
        <CommandLineIcon className="w-4 h-4 text-white" aria-hidden="true" />
        <span className="ml-2 font-mono">console</span>
      </div>
      <div className="h-32 pt-2 pl-2 overflow-auto bg-neutral-800">
        <div
          className="font-mono text-sm whitespace-pre align h-100 bg-neutral-800"
          aria-readonly={true}
          aria-label="message console"
        >
          {logMessages.map((x, i) => {
            // electron prepends every thrown error with its own message
            // this is a hack to remove that
            let withoutElectronPart: string
            if (x.message.includes("': ")) {
              withoutElectronPart = x.message.split("': ")[1]
            } else {
              withoutElectronPart = x.message
            }

            const message = `[${x.level.toUpperCase()}] $> ${withoutElectronPart}`

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
          <div ref={consoleScrollRef} className="h-0" />
        </div>
      </div>
    </div>
  )
}
