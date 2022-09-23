import React, { ReactElement } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import GitConfigurationViewCard from './GitConfigurationViewCard'
import { useGetGitConfigurationList, useResetCache } from './ReactQueryWrappers'
import { useDebounce } from 'use-debounce'

export function GitConfigurationListScreen() {
  const resetCachesMutation = useResetCache()

  const [filter, setFilter] = React.useState<string | undefined>(undefined)

  const debouncedFilter = useDebounce(filter, 500)

  const { isLoading, data, error } = useGetGitConfigurationList(
    debouncedFilter,
    filter
  )
  let control: ReactElement | undefined = undefined
  if (isLoading || data === undefined) {
    control = <>Loading...</>
  }
  if (error) {
    control = <>Error...{error}</>
  }

  const onOpenFolderClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    window.OpenFileLocation.invoke(data!.globalGitConfigPath)
  }

  if (!isLoading && control === undefined) {
    control = (
      <div className="py-4">
        <ul role="list">
          {data?.configList
            .sort((x, y) => (x.path > y.path ? 1 : 0))
            .map(gitConfigInfo => (
              <li key={gitConfigInfo.path} className="py-4 flex-1">
                <GitConfigurationViewCard
                  gitConfigInfo={gitConfigInfo}
                  globalUser={data!.globalUser}
                />
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Git Configurations'}>
        <div className="">
          <input
            type="text"
            className=""
            placeholder="Search"
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <button
          onClick={e => onOpenFolderClick(e)}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FolderOpenIcon className="h-5 w-5 mr-2" />
          Open global config...
        </button>
        <button
          onClick={() => resetCachesMutation.mutate()}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 " />
          Rescan for projects
        </button>
      </PageHeader>
      <div className="">{control}</div>
    </div>
  )
}
