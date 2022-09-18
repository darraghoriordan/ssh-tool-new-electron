import React from 'react'
import { ErrorMessage } from '../components/ErrorMessage'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import PageHeader from '../components/PageHeader'
import GitConfigurationViewCard from './GitConfigurationViewCard'
import { useGetGitConfigurationList } from './ReactQueryWrappers'

export function GitConfigurationListScreen() {
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

  return (
    <>
      <PageHeader pageTitle={'Git Configurations'}>
        <button
          onClick={() => console.log('clicked')}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 " />
          Refresh all
        </button>
      </PageHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {data.isInError && (
            <ErrorMessage
              title={'Failed to list Git configs'}
              list={[data.errorMessage || '']}
            />
          )}

          <ul role="list">
            {data.
              .sort((x, y) => (x.path > y.path ? 1 : 0))
              .map(gitConfigInfo => (
                <li key={gitConfigInfo.path} className="py-4 flex">
                  <GitConfigurationViewCard
                    gitConfigInfo={gitConfigInfo}
                    allCustomUsers={data.allCustomUsers}
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
