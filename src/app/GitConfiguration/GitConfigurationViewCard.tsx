import { GitConfigInfo } from '../../electron/gitConfigurations/models/GitConfigInfo'
import { GitUser } from '../../electron/gitConfigurations/models/GitUser'

export class GitConfigurationViewCardProps {
  gitConfigInfo!: GitConfigInfo
  globalUser?: GitUser
}

export default function GitConfigurationViewCard(
  props: GitConfigurationViewCardProps
) {
  const origin = props.gitConfigInfo.remotes.find(x =>
    x.remoteName?.includes('origin')
  )
  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    console.log('clicked', props.gitConfigInfo.path)
    // shell.showItemInFolder(data!.meta.appSettingsFileLocation)
    window.OpenFileLocation.invoke(props.gitConfigInfo.path)
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {origin?.repoName}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {props.gitConfigInfo.path}
        </p>
        <button
          type="button"
          // disabled={resetMutation.isLoading}
          onClick={e => onOpenSettingsFolderClick(e)}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Open config...
        </button>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="">
          <dt className="text-sm font-medium text-gray-500">Current Origin</dt>
          <dd className="mt-1 text-sm text-gray-900">{origin?.url}</dd>
        </div>
        <div className="mt-4">
          <dt className="text-sm font-medium text-gray-500">Current User</dt>
          <dd className="mt-1 text-sm text-gray-900">
            {props.gitConfigInfo.user.name ||
              props.globalUser?.name + '(from global)'}
            <br />
            {props.gitConfigInfo.user.email ||
              props.globalUser?.email + '(from global)'}
          </dd>
        </div>
      </div>
    </div>
  )
}
