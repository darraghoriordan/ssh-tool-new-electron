import { GitUser } from '../../electron/services/gitConfigSystemScanner/models/GitUser'
import { GitConfigInfo } from '../../electron/services/gitConfigSystemScanner/models/GitConfigInfo'

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
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {origin?.repoName}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {props.gitConfigInfo.path}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Current Origin
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{origin?.url}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Current User</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {props.gitConfigInfo.user.name ||
                props.globalUser?.name + '(from global)'}
              <br />
              {props.gitConfigInfo.user.email ||
                props.globalUser?.email + '(from global)'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
