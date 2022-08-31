import {
  ChevronDownIcon,
  ArrowPathIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import React, { Fragment, useEffect, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ScanForSshCertsResponse } from '../../electron/services/sshCertificates/Types'
import { ErrorMessage } from '../components/ErrorMessage'
import GitSshCertificateCard from '../components/GitSshCertificateCard'
import PageHeader from '../components/PageHeader'

export function SshConfigurationScreen() {
  const [loadingCerts, setLoadingCerts] = useState(false)
  const [sshCertScanResponse, setSshCertScanResponse] = useState({
    isInError: false,
    path: '',
    privateKeys: [],
    errorMessage: undefined,
  } as ScanForSshCertsResponse)
  const wrappedInitialLoad = async () => {
    await handleInitialLoad()
  }
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }
  useEffect(() => {
    wrappedInitialLoad()

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {}
  }, [])

  const handleAddToSshAgentClick = async (
    privateKeyPath: string
  ): Promise<void> => {
    await window.AddCertToSshAgent.invoke({
      privateCertPath: privateKeyPath,
    })
    await handleReloadAllCertsClick()
  }

  const handleRemoveFromSshAgentClick = async (
    privateKeyPath: string
  ): Promise<void> => {
    await window.RemoveCertFromSshAgent.invoke({
      privateCertPath: privateKeyPath,
    })

    await handleReloadAllCertsClick()
  }

  const handleInitialLoad = async () => {
    setLoadingCerts(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sshCerts = await window.ScanForSshCerts.invoke({
      forceFileSystemSearch: false,
    })
    setSshCertScanResponse(sshCerts)
    setLoadingCerts(false)
  }

  const handleReloadAllCertsClick = async () => {
    setLoadingCerts(true)
    const sshCerts = await window.ScanForSshCerts.invoke({
      forceFileSystemSearch: true,
    })
    setSshCertScanResponse(sshCerts)
    setLoadingCerts(false)
  }

  return (
    <>
      <PageHeader pageTitle={'SSH Certificates'}>
        <button
          onClick={() => handleReloadAllCertsClick()}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2 " />
          Refresh all
        </button>
        <button
          onClick={e => handleReloadAllCertsClick()}
          type="button"
          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" /> Generate a
          new cert
        </button>
        <Menu as="div" className="ml-3 relative">
          <Menu.Button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
            More options...
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-left absolute left-0 mt-2 -ml-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    Open ssh folder
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm text-gray-700'
                    )}
                  >
                    Edit ssh config
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </PageHeader>
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {sshCertScanResponse.isInError && (
            <ErrorMessage
              title={'Failed to list Ssh Certs'}
              list={[sshCertScanResponse.errorMessage || '']}
            />
          )}
          {loadingCerts ? (
            <p>Scanning for certs...</p>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {sshCertScanResponse.privateKeys
                .sort((x, y) => (x.privateKeyPath > y.privateKeyPath ? 1 : 0))
                .map(key => (
                  <li key={key.name} className="py-4 flex">
                    <GitSshCertificateCard
                      sshCertFileInfo={key}
                      handleAddToSshAgentClick={handleAddToSshAgentClick}
                      handleRemoveFromSshAgentClick={
                        handleRemoveFromSshAgentClick
                      }
                    />
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
