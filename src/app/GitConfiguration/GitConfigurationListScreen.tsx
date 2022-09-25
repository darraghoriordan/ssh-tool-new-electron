import React, { ReactElement } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import GitConfigurationViewCard from './GitConfigurationViewCard'
import { useGetGitConfigurationList, useResetCache } from './ReactQueryWrappers'
import { useDebounce } from 'use-debounce'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'

export function GitConfigurationListScreen() {
  const faqs = [
    {
      id: 1,
      question: 'What is this tool for?',
      answer:
        'Developers often have many Git projects on their systems. This tool provides an easy way to scan a location recursively for Git configuration files.',
    },
    {
      id: 2,
      question: 'Why use it?',
      answer:
        'You can easily see which origin and which user is being used for a repository. This is useful if you use multiple Git accounts or if you have a global Git user configured.',
    },
    {
      id: 3,
      question: 'What is the rescan button?',
      answer:
        "The tool doesn't monitor your filesystem for changes or new projects. If you add a new Git project or edit a config file in a text editor, you need to click the rescan button to have it appear in the list.",
    },
    {
      id: 4,
      question: 'How do I adjust the scanned folder?',
      answer:
        'There are settings in App Settings where you can adjust the paths.',
    },
  ]
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

  const onOpenFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    location: string
  ) => {
    event.preventDefault()
    window.OpenFileLocation.invoke(location)
  }

  if (!isLoading && data && control === undefined) {
    control = (
      <div className="">
        <ul role="list">
          {data?.configList
            .sort((x, y) => (x.path > y.path ? 1 : 0))
            .map(gitConfigInfo => (
              <li key={gitConfigInfo.path} className="py-4 flex-1">
                <GitConfigurationViewCard
                  gitConfigInfo={gitConfigInfo}
                  globalUser={data.globalUser}
                />
              </li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Git Project Configurations'}>
        <div className="">
          <input
            type="text"
            className=""
            placeholder="Search"
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        {data?.globalGitConfigPath && (
          <button
            onClick={e => onOpenFolderClick(e, data.globalGitConfigPath)}
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FolderOpenIcon className="h-5 w-5 mr-2" />
            Open global Git config...
          </button>
        )}

        <button
          onClick={() => resetCachesMutation.mutate()}
          disabled={isLoading}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 " />
          Rescan for projects
        </button>
      </PageHeader>

      <DescriptionAndHelp faqs={faqs} />
      <div className="">{control}</div>
    </div>
  )
}
