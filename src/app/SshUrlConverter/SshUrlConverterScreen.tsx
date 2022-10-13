/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
  DocumentCheckIcon,
  FolderOpenIcon,
  ArrowDownIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline'
import { useConvertSshUrl } from './ReactQueryWrappers'
import { SshConverterResults } from '../../electron/sshConfigFile/models/SshConverterResults'
import { useGetSettings } from '../UserSettings/ReactQueryWrappers'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

const faqs = [
  {
    id: 1,
    question: 'What is this tool for?',
    answer:
      'If you copy a URL from a git repository, it will have a generic ssh url. This tool is aware of any local ssh aliases you have configured.',
  },
  {
    id: 2,
    question: 'Why use it?',
    answer:
      "This is useful when cloning git repositories if you use local ssh aliases. It's also useful if you quickly want to see what the ssh or http url is for a repository.",
  },
  {
    id: 3,
    question: 'What are local ssh aliases?',
    answer:
      "If you have a local ssh alias configured, you can use the alias in place of the full ssh url. For example, if you have an alias called 'pgh' configured with your private github ssh certificate, you can use 'git clone git@pgh:username/repo' instead of of 'git clone git@github.com:username/repo'.",
  },
  {
    id: 4,
    question: 'How do I adjust the ssh config file location?',
    answer:
      'There are settings in App Settings where you can adjust the paths.',
  },
]

export const SshUrlConverterScreen = () => {
  const mutation = useConvertSshUrl()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState<
    SshConverterResults | undefined
  >(undefined)
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  let control: ReactElement | undefined = undefined
  const { isLoading, data, error } = useGetSettings()

  const onCopyClick = (
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

  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    return runAction()
  }
  const runAction = async () => {
    const input = {
      gitUrl: inputValue,
    }

    if (!input.gitUrl || input.gitUrl.length < 4) {
      logAMessage({ message: 'You must enter a git url', level: 'error' })
      return
    }

    const result = await mutation.mutateAsync(input)
    setOutputValue(result.possibleGitUrls)
  }
  const handleInputKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      return runAction()
    }
  }
  const onOpenFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    location: string
  ) => {
    event.preventDefault()
    window.OpenFileLocation.invoke(location)
  }

  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setInputValue(
      'https://github.com/darraghoriordan/eslint-plugin-nestjs-typed.git'
    )
  }

  if (isLoading) {
    control = <>Loading...</>
  }

  if (mutation) {
    control = (
      <>
        <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6">
          <div className="mb-8">
            <div className="flex mt-1 rounded-md shadow-sm">
              <input
                name="data"
                id="data"
                onKeyDown={handleInputKeyDown}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Paste a git ssh or http url here and press Enter/Submit"
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {outputValue?.httpUrl && (
              <>
                <p className="mt-8 mb-2 text-gray-500 text-md leading-5">
                  http direct url
                </p>
                <div className="flex items-center">
                  <button
                    type="button"
                    // disabled={resetMutation.isLoading}
                    onClick={e =>
                      onCopyClick(e, `git clone ${outputValue?.httpUrl}`)
                    }
                    className="inline-flex items-center px-2 py-2 mr-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                    Copy
                  </button>
                  <span className="font-mono">
                    git clone {outputValue?.httpUrl}
                  </span>
                </div>
              </>
            )}
            {outputValue?.sshUrl && (
              <>
                <p className="mt-4 mb-2 text-gray-500 text-md leading-5">
                  ssh direct url
                </p>
                <div className="flex items-center">
                  <button
                    type="button"
                    // disabled={resetMutation.isLoading}
                    onClick={e =>
                      onCopyClick(e, `git clone ${outputValue?.sshUrl}`)
                    }
                    className="inline-flex items-center px-2 py-2 mr-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                    Copy
                  </button>
                  <span className="font-mono">
                    git clone {outputValue?.sshUrl}
                  </span>
                </div>
              </>
            )}

            {outputValue?.sshAliases.map((x, i) => (
              <div key={i}>
                <p className="mt-4 mb-2 text-gray-500 text-md leading-5">
                  {x.alias}
                </p>
                <div className="flex items-center">
                  <button
                    type="button"
                    // disabled={resetMutation.isLoading}
                    onClick={e => onCopyClick(e, `git clone ${x.url}`)}
                    className="inline-flex items-center px-2 py-2 mr-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                    Copy
                  </button>
                  <span className="font-mono">git clone {x.url}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
  return (
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'Git Url Converter'}>
        {data?.sshConfigFilePath && (
          <button
            onClick={e => onOpenFolderClick(e, data.sshConfigFilePath)}
            type="button"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FolderOpenIcon className="w-5 h-5 mr-2" />
            Open global ssh config...
          </button>
        )}
        <button
          onClick={e => insertSampleValue(e)}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="w-5 h-5 mr-2" />
          Try with sample data
        </button>
        <button
          type="button"
          onClick={e => onSubmitClick(e)}
          disabled={mutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Submit
        </button>
      </PageHeader>
      <DescriptionAndHelp faqs={faqs} />
      {control}
    </div>
  )
}
