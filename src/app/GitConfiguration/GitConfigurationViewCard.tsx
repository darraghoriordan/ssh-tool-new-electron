import { GitConfigInfo } from '../../electron/gitConfigurations/models/GitConfigInfo'
import { GitUser } from '../../electron/gitConfigurations/models/GitUser'
import {
  FolderOpenIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

export class GitConfigurationViewCardProps {
  gitConfigInfo!: GitConfigInfo
  globalUser?: GitUser
}

const GitConfigurationViewCard = (props: GitConfigurationViewCardProps) => {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const origin = props.gitConfigInfo.remotes.find(x =>
    x.remoteName?.includes('origin')
  )
  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()

    window.OpenFileLocation.invoke(props.gitConfigInfo.path)
    logAMessage({
      message: 'Opened settings file path.',
      level: 'info',
    })
  }

  const onCopyForGitConfigClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: string
  ) => {
    event.preventDefault()

    navigator.clipboard.writeText(value)
    logAMessage({
      message: 'Copied to clipboard.',
      level: 'info',
    })
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {origin?.repoName}
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="mb-4">
          <dt className="text-sm font-medium text-gray-500">Config Location</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {props.gitConfigInfo.path}
          </dd>
        </div>
        <div className="mb-4">
          <dt className="text-sm font-medium text-gray-500">Git Origin</dt>
          <dd className="mt-1 text-sm text-gray-900">{origin?.url}</dd>
        </div>
        <div className="">
          <dt className="text-sm font-medium text-gray-500">
            Git User
            {!props.gitConfigInfo.isProjectUserSet &&
              '(🌏 currently using global user 🌎)'}
          </dt>
          {props.gitConfigInfo.user ? (
            <dd className="mt-1 text-sm text-gray-900">
              {props.gitConfigInfo.user.name}
              <br />
              {props.gitConfigInfo.user.email}
            </dd>
          ) : (
            <dd className="mt-1 text-sm text-gray-900">
              No Git user set (you should at least set the [user] in the global
              configuration)
            </dd>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6 flex justify-start space-x-3">
        <button
          type="button"
          // disabled={resetMutation.isLoading}
          onClick={e => onOpenSettingsFolderClick(e)}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FolderOpenIcon className="h-5 w-5 mr-2" />
          Open config location...
        </button>
        {props.gitConfigInfo.userAsIniString && (
          <button
            type="button"
            // disabled={resetMutation.isLoading}
            onClick={e =>
              onCopyForGitConfigClick(
                e,
                props.gitConfigInfo.userAsIniString || ''
              )
            }
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
            Copy user in git config format
          </button>
        )}
      </div>
    </div>
  )
}

export default GitConfigurationViewCard
