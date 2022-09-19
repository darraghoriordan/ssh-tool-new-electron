/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import PageHeader from '../components/PageHeader'
import { useForm } from 'react-hook-form'
import {
  useGetSettings,
  useResetSettings,
  useSaveSettings,
} from './ReactQueryWrappers'

export function SettingsScreen() {
  const { register, handleSubmit, reset } = useForm()

  const { isLoading, data, error } = useGetSettings()
  const saveMutation = useSaveSettings()
  const resetMutation = useResetSettings()

  const onResetClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    resetMutation.mutate()
    // UNLESS THE ABOVE RETURNS DATA THIS BREAKS
    reset()
  }

  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    // shell.showItemInFolder(data!.meta.appSettingsFileLocation)
    window.OpenFileLocation.invoke(data!.meta.appSettingsFileLocation)
  }

  if (isLoading || data === undefined) {
    return <>Loading...</>
  }
  if (error) {
    return <>Error...{error}</>
  }
  if (saveMutation.isError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <>Error...{saveMutation.error.message}</>
  }

  return (
    <>
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
          })
        })}
      >
        <PageHeader pageTitle={'App Settings'}>
          {data && (
            <button
              type="button"
              disabled={resetMutation.isLoading}
              onClick={e => onOpenSettingsFolderClick(e)}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Open settings folder
            </button>
          )}

          <button
            type="button"
            disabled={resetMutation.isLoading}
            onClick={e => onResetClick(e)}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Reset To Defaults
          </button>
          <button
            type="submit"
            disabled={saveMutation.isLoading}
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </PageHeader>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="sshCertPath"
                      className="block text-sm font-medium text-gray-700"
                    >
                      SSH certs path
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        {...register('sshCertPath')}
                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={data.settings.sshCertPath}
                      />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="projectsPath"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Git project paths
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        {...register('projectsPath')}
                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={data.settings.projectsPath}
                      />
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <label
                      htmlFor="globalGitConfigFile"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Git Global Config File
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <input
                        {...register('globalGitConfigFile')}
                        className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={data.settings.globalGitConfigFile}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
