/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
  DocumentCheckIcon,
  FolderOpenIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import { useConvertSshUrl } from './ReactQueryWrappers'
import { SshConverterResults } from '../../electron/sshConfigFile/models/SshConverterResults'
import { useGetSettings } from '../UserSettings/ReactQueryWrappers'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'

export function SshUrlConverterScreen() {
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
  const mutation = useConvertSshUrl()
  const [inputValue, setInputValue] = useState('')
  const [outputValue, setOutputValue] = useState<
    SshConverterResults | undefined
  >(undefined)

  let control: ReactElement | undefined = undefined
  const { isLoading, data, error } = useGetSettings()

  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const input = {
      gitUrl: inputValue,
    }
    console.log('input', input)

    if (!input.gitUrl) {
      // throw an error
    }

    const result = await mutation.mutateAsync(input)
    console.log(result)
    setOutputValue(result.possibleGitUrls)
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
        {error && <span>Error...{error.message}</span>}
        {mutation.isError && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <span>Error...{(mutation as any).error?.message}</span>
        )}
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
          <div className="mb-8">
            <label
              htmlFor="data"
              className="block text-sm font-medium text-gray-700"
            >
              Enter an ssh or http git url
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                name="data"
                id="data"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="paste a git url here"
                className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            {outputValue?.httpUrl && (
              <>
                <p className="text-sm leading-5 text-gray-500 mt-8">
                  http direct url
                </p>

                <span className="font-mono">
                  git clone {outputValue?.httpUrl}
                </span>
              </>
            )}
            {outputValue?.sshUrl && (
              <>
                <p className="text-sm leading-5 text-gray-500 mt-4">
                  ssh direct url
                </p>

                <span className="font-mono">
                  git clone {outputValue?.sshUrl}
                </span>
              </>
            )}

            {outputValue?.sshAliases.map((x, i) => (
              <div key={i}>
                <p className="text-sm leading-5 text-gray-500 mt-4">
                  {x.alias}
                </p>
                <span className="font-mono">git clone {x.url}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Git Url Converter'}>
        {data?.sshConfigFilePath && (
          <button
            onClick={e => onOpenFolderClick(e, data.sshConfigFilePath)}
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FolderOpenIcon className="h-5 w-5 mr-2" />
            Open global ssh config...
          </button>
        )}
        <button
          onClick={e => insertSampleValue(e)}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="h-5 w-5 mr-2" />
          Try with sample data
        </button>
        <button
          type="button"
          onClick={e => onSubmitClick(e)}
          disabled={mutation.isLoading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="h-5 w-5 mr-2 " />
          Submit
        </button>
      </PageHeader>
      <DescriptionAndHelp faqs={faqs} />
      {control}
    </div>
  )
}
