import React, { PropsWithChildren, useState } from 'react'
import { ConsoleLogMessage } from './Console'

export const ConsoleContext = React.createContext(
  [] as unknown as [
    { message: string; level: string }[],
    (message: ConsoleLogMessage) => void
  ]
)

export const ConsoleProvider = (props: PropsWithChildren) => {
  const [logMessages, setLogMessages] = useState([
    { message: 'Starting up...', level: 'info' },
  ])

  const logAMessage = (message: ConsoleLogMessage) => {
    setLogMessages(prev => [...prev, message])
  }
  return (
    <ConsoleContext.Provider value={[logMessages, logAMessage]}>
      {props.children}
    </ConsoleContext.Provider>
  )
}
