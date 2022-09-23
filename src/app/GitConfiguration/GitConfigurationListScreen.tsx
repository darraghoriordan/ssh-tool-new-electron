import React from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import PageHeader from '../components/PageHeader'
import GitConfigurationViewCard from './GitConfigurationViewCard'
import { useGetGitConfigurationList, useResetCache } from './ReactQueryWrappers'

export function GitConfigurationListScreen() {
  const resetCachesMutation = useResetCache()
  const { isLoading, data, error } = useGetGitConfigurationList()
  if (isLoading || data === undefined) {
    return <>Loading...</>
  }
  if (error) {
    return <>Error...{error}</>
  }
  // i think this should really be some other call that is a mutation that
  // deletes the cache on the server side and invalidates the plain old get
  //   const {
  //     isLoading: isLoading2,
  //     data: data2,
  //     error: error2,
  //   } = useGetGitConfigurationList({
  //     forceFileSystemSearch: true,
  //   })
  const onOpenFolderClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    window.OpenFileLocation.invoke(data.globalGitConfigPath)
  }
  return (
    <>
      <PageHeader pageTitle={'Git Configurations'}>
        <button
          onClick={e => onOpenFolderClick(e)}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Open global config...
        </button>
        <button
          onClick={() => resetCachesMutation.mutate()}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 " />
          Scan for projects
        </button>
      </PageHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <ul role="list">
            {data.configList
              .sort((x, y) => (x.path > y.path ? 1 : 0))
              .map(gitConfigInfo => (
                <li key={gitConfigInfo.path} className="py-4 flex">
                  <GitConfigurationViewCard
                    gitConfigInfo={gitConfigInfo}
                    globalUser={data.globalUser}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </>
  )
}
