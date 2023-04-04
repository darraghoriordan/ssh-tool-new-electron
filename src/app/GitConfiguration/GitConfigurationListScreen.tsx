import React, { ReactElement, useContext, useEffect } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import {
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/outline'
import PageHeader from '../components/PageHeader'
import GitConfigurationViewCard from './GitConfigurationViewCard'
import { useGetGitConfigurationList, useResetCache } from './ReactQueryWrappers'
import { useDebounce } from 'use-debounce'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import EmptyList from './EmptyList'
import WarningList from './WarningList'

const faqs = [
  {
    id: 1,
    question: 'What is this tool for?',
    answer:
      'Developers often have many Git projects on their systems. This tool provides an easy way to scan a location recursively for Git configuration files. You can easily see a summary of each configuration and edit the config for a repo.',
  },
  {
    id: 2,
    question: 'Why use it?',
    answer:
      "You can easily see which origin and which user is being used for a repository. You will also get warnings if the user you will commit with for a repo doesn't match all the other repos for the same git host. This is useful if you use multiple Git accounts or if you have a global Git user configured.",
  },
  {
    id: 3,
    question: 'Using [includeIf]',
    answer:
      'If you keep all associated projects in a folder tree, you can use the [includeIf] directive in your global Git config to include a config file with a different user per folder path. This tool will not show the included config file values.',
  },
  {
    id: 4,
    question: 'What is the rescan button?',
    answer:
      "The tool doesn't monitor your filesystem for changes or new projects. If you add a new Git project or edit a config file in a text editor, you need to click the rescan button to have it appear in the list.",
  },
  {
    id: 5,
    question: 'How do I adjust the scanned folder?',
    answer:
      'There are settings in the "App Settings" section where you can adjust the paths.',
  },
]

export function GitConfigurationListScreen() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  const resetCachesMutation = useResetCache()

  const [filter, setFilter] = React.useState<string | undefined>(undefined)
  const [debouncedFilter, debounceControl] = useDebounce(filter, 500)

  const { isLoading, data } = useGetGitConfigurationList(debouncedFilter)

  let control: ReactElement | undefined = undefined
  if (isLoading) {
    control = <>Loading configuration...</>
  }

  const onOpenFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    location: string
  ) => {
    event.preventDefault()
    logAMessage({ level: 'info', message: `Opening folder ${location}` })
    window.OpenFileLocation.invoke(location)
  }

  if (isLoading) {
    control = <div>Scanning your system...</div>
  } else if (
    (data?.configList || []).length <= 0 &&
    (filter === undefined || filter === '')
  ) {
    control = <EmptyList />
  } else {
    control = (
      <div>
        {data?.warningsList && data?.warningsList.length > 0 && (
          <WarningList warnings={data.warningsList} />
        )}

        <ul>
          {data?.configList
            .sort((x, y) => (x.path > y.path ? 1 : 0))
            .map(gitConfigInfo => (
              <li key={gitConfigInfo.path} className="flex-1 py-4">
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
    <div className="mx-auto max-w-10xl">
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
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FolderOpenIcon className="w-5 h-5 mr-2" />
            Open global Git config...
          </button>
        )}

        <button
          onClick={() => resetCachesMutation.mutate()}
          disabled={isLoading}
          type="button"
          className="inline-flex items-center text-sm font-medium text-white bg-indigo-600 border border-transparent rounded px-2.5 py-1.5 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="w-5 h-5 mr-2" />
          Rescan git projects
        </button>
        <div className="text-xs">
          Last scan
          <br />
          {new Date(data?.created || 0).toLocaleDateString()}
        </div>
      </PageHeader>

      <DescriptionAndHelp faqs={faqs} />
      <div>{control}</div>
    </div>
  )
}
