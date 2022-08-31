import React, { useEffect, useState } from 'react'
import { OpenFileResponseMessage } from '../../electron/sshConfigFileChannels/MessageTypes'

export function SshConfigurationScreen() {
  const [sshFileContents, setSshFileContents] = useState({
    contents: [],
    found: false,
    path: '',
  } as OpenFileResponseMessage)

  useEffect(() => {
    ;(async () => {
      window.SimpleMessage.invoke('Messaging - Save ssh config')
      const response = await window.OpenSshFile.invoke()
      setSshFileContents(response)
    })()
  }, [])

  const handleReloadAllCertsClick = async () => {
    window.SimpleMessage.invoke('Messaging - Save ssh config')
    const response = await window.OpenSshFile.invoke()
    setSshFileContents(response)
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          SSH configuration
        </h1>
      </div>
      <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <button
          onClick={() => handleReloadAllCertsClick()}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Refresh all
        </button>
        {sshFileContents.found && (
          <pre>{JSON.stringify(sshFileContents.contents)}</pre>
        )}
        {!sshFileContents.found && (
          <div>
            <p>Not found... change the file path.</p>
          </div>
        )}
      </div>
    </>
  )
}
