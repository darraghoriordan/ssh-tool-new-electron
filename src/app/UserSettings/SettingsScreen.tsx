/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext } from 'react'
import PageHeader from '../components/PageHeader'
import { useForm } from 'react-hook-form'
import {
  useGetSettings,
  useResetSettings,
  useSaveSettings,
} from './ReactQueryWrappers'
import {
  ArrowPathIcon,
  DocumentCheckIcon,
  FolderOpenIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { useGetAppSettings } from '../AppSettings/ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'

import SettingsFormSection from './SettingsFormSection'
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()
  const { data: appSettings } = useGetAppSettings()

  const { isLoading, data } = useGetSettings()
  const saveMutation = useSaveSettings()
  const resetMutation = useResetSettings()
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  const onResetClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const settingsResponse = await resetMutation.mutateAsync()
    // UNLESS THE ABOVE RETURNS DATA THIS BREAKS
    reset(settingsResponse)
  }

  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    // shell.showItemInFolder(data!.meta.appSettingsFileLocation)
    window.OpenFileLocation.invoke(
      appSettings!.runtimeApplicationSettings.userSettingsFileLocation
    )
  }
  let control: ReactElement | undefined = undefined
  if (isLoading || data === undefined) {
    control = <>Loading...</>
  }

  if (!isLoading && data && control === undefined) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6 space-y-16">
        <SettingsFormSection
          header="Git Settings"
          subHeader="Used for working with your git repositories."
          sections={[
            {
              propertyKey: 'projectsPath',
              labelText: 'Git project path to scan for repositories',
            },
            {
              propertyKey: 'globalGitConfigFile',
              labelText: 'Global Git Config File',
            },
          ]}
          register={register}
          errors={errors}
          data={data}
        />
        <SettingsFormSection
          header="Ssh Settings"
          subHeader="Used for working with ssh certificates"
          sections={[
            {
              propertyKey: 'sshConfigFilePath',
              labelText: 'SSH Config File',
            },
          ]}
          register={register}
          errors={errors}
          data={data}
        />
        <SettingsFormSection
          header="Open Api Settings"
          subHeader="Used for working with Open Api"
          sections={[
            {
              propertyKey: 'openApiChatGptKey',
              labelText:
                'ChatGPT Api Key ( https://platform.openai.com/account/api-keys )',
              isRequired: false,
            },
            {
              propertyKey: 'openApiOrgId',
              labelText:
                'Open Api Org Id ( https://platform.openai.com/account/org-settings )',
              isRequired: false,
            },
          ]}
          register={register}
          errors={errors}
          data={data}
        />
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-10xl">
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <form
        className="space-y-6"
        action="#"
        method="POST"
        // eslint-disable-next-line react/no-unknown-property
        onError={e => {
          logAMessage({ message: `Form error at ${e.target}`, level: 'error' })
        }}
        onSubmit={handleSubmit(data => {
          saveMutation.mutate({
            projectsPath: data['projectsPath']!,
            globalGitConfigFile: data['globalGitConfigFile'],
            sshConfigFilePath: data['sshConfigFilePath'],
            openApiChatGptKey: data['openApiChatGptKey'],
          })
        })}
      >
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

          <button
            type="button"
            disabled={resetMutation.isLoading}
            onClick={e => onResetClick(e)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Reset All To Defaults
          </button>

          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <XMarkIcon className="w-5 h-5 mr-2" />
            Cancel Changes
          </button>

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
      </form>
    </div>
  )
}
