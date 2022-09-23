/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement } from 'react'
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

export function SettingsScreen() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()

  const { isLoading, data, error } = useGetSettings()
  const saveMutation = useSaveSettings()
  const resetMutation = useResetSettings()

  const onResetClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const settingsResponse = await resetMutation.mutateAsync()
    // UNLESS THE ABOVE RETURNS DATA THIS BREAKS
    reset(settingsResponse.settings)
  }

  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    // shell.showItemInFolder(data!.meta.appSettingsFileLocation)
    window.OpenFileLocation.invoke(data!.meta.appSettingsFileLocation)
  }
  let control: ReactElement | undefined = undefined
  if (isLoading || data === undefined) {
    control = <>Loading...</>
  }
  if (error) {
    control = <>Error...{error}</>
  }
  if (saveMutation.isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control = <>Error...{saveMutation.error.message}</>
  }

  if (!isLoading && data && control === undefined) {
    control = (
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              General Settings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              These settings affect the whole application.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-3 ">
                <label
                  htmlFor="sshCertPath"
                  className="block text-sm font-medium text-gray-700"
                >
                  SSH certs path
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('sshCertPath', { required: true, min: 1 })}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={data.settings.sshCertPath}
                  />
                </div>
                {errors.sshCertPath && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>
              <div className="col-span-3 ">
                <label
                  htmlFor="projectsPath"
                  className="block text-sm font-medium text-gray-700"
                >
                  Git project path
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('projectsPath', { required: true, min: 1 })}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={data.settings.projectsPath}
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
                  Git Global Config File
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    {...register('globalGitConfigFile', {
                      required: true,
                      min: 1,
                    })}
                    className="block w-full rounded-md border border-gray-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={data.settings.globalGitConfigFile}
                  />
                </div>
                {errors.globalGitConfigFile && (
                  <span className="text-red-600">This field is required</span>
                )}
              </div>

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
                    defaultValue={data.settings.sshConfigFilePath}
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
          throw new Error('FORM SAVE ERROR')
        }}
        onSubmit={handleSubmit(data => {
          console.log('data', data)
          saveMutation.mutate({
            sshCertPath: data['sshCertPath']!,
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
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

        {control}
      </form>
    </div>
  )
}
