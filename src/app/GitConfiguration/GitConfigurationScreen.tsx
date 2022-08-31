import React, { useEffect, useState } from 'react'
import { GitConfigScanResponseMessage } from '../../electron/gitConfigurationFileChannels/MessageTypes'
import { ErrorMessage } from '../components/ErrorMessage'
import GithubAccountCard from '../components/GithubAccountCard'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import PageHeader from '../components/PageHeader'

export function GitConfigurationScreen() {
  const [loadingGitConfigs, setLoadingGitConfigs] = useState(false)
  const [gitConfigScanResponse, setGitConfigScanResponse] = useState({
    isInError: false,
    path: '',
    contents: [],
    errorMessage: undefined,
    foundHomeDirectory: false,
    isCachedData: false,
    allCustomUsers: [],
  } as GitConfigScanResponseMessage)

  useEffect(() => {
    ;(async () => {
      await handleInitialLoad()
    })()
  }, [])

  const handleInitialLoad = async () => {
    setLoadingGitConfigs(true)
    const gitConfigPaths = await window.ScanGitConfigFiles.invoke({
      forceFileSystemSearch: false,
    })
    setGitConfigScanResponse(gitConfigPaths)
    setLoadingGitConfigs(false)
  }

  const handleReloadAllConfigsClick = async () => {
    setLoadingGitConfigs(true)
    const gitConfigPaths = await window.ScanGitConfigFiles.invoke({
      forceFileSystemSearch: true,
    })
    setGitConfigScanResponse(gitConfigPaths)
    setLoadingGitConfigs(false)
  }

  return (
    <>
      <PageHeader pageTitle={'Git Configurations'}>
        <button
          onClick={() => handleReloadAllConfigsClick()}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 " />
          Refresh all
        </button>
      </PageHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {gitConfigScanResponse.isInError && (
            <ErrorMessage
              title={'Failed to list Git configs'}
              list={[gitConfigScanResponse.errorMessage || '']}
            />
          )}
          {loadingGitConfigs ? (
            <p>Scanning for git configs...</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {gitConfigScanResponse.contents
                .sort((x, y) => (x.path > y.path ? 1 : 0))
                .map(gitConfigInfo => (
                  <li key={gitConfigInfo.path} className="py-4 flex">
                    <GithubAccountCard
                      gitConfigInfo={gitConfigInfo}
                      allCustomUsers={gitConfigScanResponse.allCustomUsers}
                      globalUser={gitConfigScanResponse.globalUser}
                    />
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
