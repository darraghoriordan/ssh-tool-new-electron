import { GitUser } from '../../electron/services/gitConfigSystemScanner/models/GitUser'
import { GitConfigInfo } from '../../electron/services/gitConfigSystemScanner/models/GitConfigInfo'
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline'

export class GithubAccountCardProps {
  gitConfigInfo!: GitConfigInfo
  allCustomUsers!: GitUser[]
  globalUser?: GitUser
}

export default function GithubAccountCard(props: GithubAccountCardProps) {
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
            <dt className="text-sm font-medium text-gray-500">Change Origin</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <select
                id="origin"
                name="origin"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue="Select new origin"
              >
                <option value="Select new origin">Select new origin</option>
                {props.gitConfigInfo.potentialOrigins &&
                  props.gitConfigInfo.potentialOrigins.map(o => (
                    <option key={o.url} value={o.url}>
                      {o.url}
                    </option>
                  ))}
              </select>
              <button
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={() => {}}
                type="button"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2 " />
                Save new origin
              </button>
            </dd>
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
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Change User</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <select
                id="origin"
                name="origin"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                defaultValue="Select new user"
              >
                <option value="Select new user">Select new user</option>
                {props.allCustomUsers &&
                  props.allCustomUsers.map(o => (
                    <option
                      key={`${o.name} - ${o.email}`}
                      value={o.email}
                    >{`${o.name} - ${o.email}`}</option>
                  ))}
              </select>
              <button
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onClick={() => {}}
                type="button"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2 " />
                Save new user
              </button>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
