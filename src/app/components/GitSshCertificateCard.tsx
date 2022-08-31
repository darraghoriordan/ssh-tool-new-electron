import { SshCertFileInfo } from '../../electron/services/sshCertificates/Types'
import { Switch } from '@headlessui/react'
import GitConnectionList from './GitConnectionList'
import { ClipboardIcon } from '@heroicons/react/24/outline'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export class GitSshCertificateCardProps {
  sshCertFileInfo!: SshCertFileInfo
  handleRemoveFromSshAgentClick!: (path: string) => void
  handleAddToSshAgentClick!: (path: string) => void
}

export default function GitSshCertificateCard(
  props: GitSshCertificateCardProps
) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg py-5 px-6">
      <h3 className="text-3xl font-semibold leading-6 text-gray-900">
        {props.sshCertFileInfo.name}
      </h3>
      <div className="border-t border-gray-200 mt-4 pt-4">
        <h3 className="text-sm font-medium text-gray-900">Public cert path</h3>
        <div className="mt-2 flex items-start justify-between">
          <div className="max-w-xl">
            <span className="text-sm text-gray-500">
              {props.sshCertFileInfo.publicKeyPath}
            </span>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ClipboardIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Copy public cert
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 mt-4">
        <Switch.Group as="div" className="">
          <Switch.Label
            as="h3"
            className="text-sm font-medium text-gray-900"
            passive
          >
            Use ssh agent
          </Switch.Label>
          <div className="mt-2 sm:flex sm:items-start sm:justify-between">
            <div className="max-w-xl text-sm text-gray-500">
              <Switch.Description as="span" className="text-sm text-gray-500">
                Storing the cert in ssh agent means you don't have to type your
                password on each use
              </Switch.Description>
            </div>
            <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
              <Switch
                checked={props.sshCertFileInfo.foundInAgentList}
                onChange={(newValue: boolean) => {
                  if (newValue === false) {
                    props.handleRemoveFromSshAgentClick(
                      props.sshCertFileInfo.privateKeyPath || '' // no pkey if using http
                    )
                  } else {
                    props.handleAddToSshAgentClick(
                      props.sshCertFileInfo.privateKeyPath || '' // no pkey if using http
                    )
                  }
                }}
                className={classNames(
                  props.sshCertFileInfo.foundInAgentList
                    ? 'bg-indigo-600'
                    : 'bg-gray-200',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                )}
              >
                <span
                  aria-hidden="true"
                  className={classNames(
                    props.sshCertFileInfo.foundInAgentList
                      ? 'translate-x-5'
                      : 'translate-x-0',
                    'inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  )}
                />
              </Switch>
            </div>
          </div>
        </Switch.Group>
        <div className="border-t border-gray-200 py-4 mt-4">
          <GitConnectionList
            connections={[
              { hostname: 'this@isahost', name: 'githubx' },
              { hostname: 'another:one', name: 'this is' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}
