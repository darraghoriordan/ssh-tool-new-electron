/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement } from 'react'
import PageHeader from '../components/PageHeader'
import {
  useGetSettings,
  useResetSettings,
  useSaveSettings,
  useSelectGitConfigFilePath,
  useSelectGitProjectsPath,
  useSelectSshConfigFilePath,
} from './ReactQueryWrappers'
import { DocumentCheckIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { useGetAppSettings } from '../AppSettings/ReactQueryWrappers'
import { SettingsForm } from './SettingsForm'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
const faqs = [
  {
    id: 1,
    question: 'Git Projects Path',
    answer:
      'This setting controls where the app will look for git projects. It will look in this folder and all subfolders. You should make sure this setting is correct before using the Git Project Tool.',
  },
  {
    id: 2,
    question: 'Global Git Config File',
    answer:
      "This setting controls where the app will look for your global git config file. It's used to determine your global git username and email address.",
  },
  {
    id: 3,
    question: 'Ssh Config File',
    answer:
      "This setting controls where the app will look for your ssh config file. It's used to determine your local ssh aliases. You should make sure this setting is correct before using the Git Url Tool.",
  },
  {
    id: 4,
    question: 'ChatGPT Api Key',
    answer:
      'The ChatGPT Api Key is used to access the ChatGPT API. You can get a free API key by signing up at https://chatgpt.com.',
  },
]

export const SettingsScreen = () => {
  const { data: appSettings } = useGetAppSettings()
  const setProjectsPathMutation = useSelectGitProjectsPath()
  const setGitConfigFilePathMutation = useSelectGitConfigFilePath()
  const setSshConfigFilePathMutation = useSelectSshConfigFilePath()
  const { isLoading, data } = useGetSettings()
  const saveMutation = useSaveSettings()
  const resetMutation = useResetSettings()

  //   const onResetClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //     event.preventDefault()
  //     const settingsResponse = await resetMutation.mutateAsync()
  //   }
  const onSelectGitProjectPath = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setProjectsPathMutation.mutateAsync()
  }
  const onSelectGitConfigFilePath = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setGitConfigFilePathMutation.mutateAsync()
  }
  const onSelectSshConfigFilePath = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setSshConfigFilePathMutation.mutateAsync()
  }
  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    // shell.showItemInFolder(data!.meta.appSettingsFileLocation)
    window.OpenFileLocation.invoke(
      appSettings!.runtimeApplicationSettings.userSettingsFileLocation,
    )
  }
  let control: ReactElement | undefined = undefined
  if (isLoading || data === undefined) {
    control = <>Loading...</>
  }
  const handleSubmit = async (data: UserSettings) => {
    saveMutation.mutate({
      projectsPath: data['projectsPath']!,
      globalGitConfigFile: data['globalGitConfigFile'],
      sshConfigFilePath: data['sshConfigFilePath'],
      openApiChatGptKey:
        data['openApiChatGptKey'] === '' || !data['openApiChatGptKey']
          ? undefined
          : data['openApiChatGptKey'],
    })
  }
  if (!isLoading && data && control === undefined) {
    control = (
      <SettingsForm
        data={data}
        onSubmit={handleSubmit}
        onOpenSelectGitProjectDirectoryClick={onSelectGitProjectPath}
        onOpenSelectGitConfigFileClick={onSelectGitConfigFilePath}
        onOpenSelectSshConfigFileClick={onSelectSshConfigFilePath}
      />
    )
  }
  return (
    <div className="mx-auto max-w-10xl">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}

      <PageHeader pageTitle={'App Settings'}>
        {data && (
          <button
            type="button"
            disabled={resetMutation.isLoading}
            onClick={e => onOpenSettingsFolderClick(e)}
            className="inline-flex items-center invisible px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FolderOpenIcon className="w-5 h-5 mr-2" />
            Edit settings as JSON...
          </button>
        )}

        {/* <button
            type="button"
            disabled={resetMutation.isLoading}
            onClick={e => onResetClick(e)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Reset All To Defaults
          </button> */}

        {/* <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            Cancel Changes
          </button> */}

        <button
          type="submit"
          disabled={saveMutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Save
        </button>
      </PageHeader>
      <DescriptionAndHelp faqs={faqs} />
      {control}
    </div>
  )
}
