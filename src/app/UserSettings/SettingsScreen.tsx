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
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Git Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Used for working with your git repositories.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 ">
                <label
                  htmlFor="projectsPath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Git project path to scan for repositories
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('projectsPath', { required: true, min: 1 })}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={data.projectsPath}
                  />
                </div>
                {errors.projectsPath && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
              <div className="col-span-3 ">
                <label
                  htmlFor="globalGitConfigFile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Global Git Config File
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('globalGitConfigFile', {
                      required: true,
                      min: 1,
                    })}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={data.globalGitConfigFile}
                  />
                </div>
                {errors.globalGitConfigFile && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Ssh Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Used for working with ssh certificates
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 ">
                <label
                  htmlFor="sshConfigFilePath"
                  className="block text-sm font-medium text-gray-700"
                >
                  SSH Config File
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('sshConfigFilePath', {
                      required: true,
                      min: 1,
                    })}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={data.sshConfigFilePath}
                  />
                </div>

                {errors.sshConfigFilePath && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="max-w-10xl mx-auto">
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onError={e => {
          logAMessage({ message: `Form error at ${e.target}`, level: 'error' })
        }}
        onSubmit={handleSubmit(data => {
          saveMutation.mutate({
            projectsPath: data['projectsPath']!,
            globalGitConfigFile: data['globalGitConfigFile'],
            sshConfigFilePath: data['sshConfigFilePath'],
          })
        })}
      >
        <PageHeader pageTitle={'App Settings'}>
          {data && (
            <button
              type="button"
              disabled={resetMutation.isLoading}
              onClick={e => onOpenSettingsFolderClick(e)}
              className="invisible inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <FolderOpenIcon className="h-5 w-5 mr-2" />
              Edit settings as JSON...
            </button>
          )}

          <button
            type="button"
            disabled={resetMutation.isLoading}
            onClick={e => onResetClick(e)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2 " />
            Reset All To Defaults
          </button>

          <button
            type="button"
            onClick={() => reset()}
            disabled={!isDirty}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <XMarkIcon className="h-5 w-5 mr-2 " />
            Cancel Changes
          </button>

          <button
            type="submit"
            disabled={saveMutation.isLoading}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <DocumentCheckIcon className="h-5 w-5 mr-2 " />
            Save
          </button>
        </PageHeader>
        <DescriptionAndHelp faqs={faqs} />
        {control}
      </form>
    </div>
  )
}
