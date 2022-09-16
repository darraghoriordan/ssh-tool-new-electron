/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import PageHeader from '../components/PageHeader'
import { useForm } from 'react-hook-form'
import { useGetSettings, useSaveSettings } from './ReactQueryWrappers'

export function SettingsScreen() {
  const { register, handleSubmit } = useForm()

  const { status, data, error } = useGetSettings()
  const saveMutation = useSaveSettings()

  if (status === 'loading' || data === undefined) {
    return <>Loading...</>
  }
  if (status === 'error') {
    return <>Error...{error}</>
  }

  return (
    <>
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmit(data =>
          saveMutation.mutate({
            sshCertPath: data['sshCertPath']!,
            projectsPath: data['projectsPath']!,
          })
        )}
      >
        <PageHeader pageTitle={'App Settings'}>
          {' '}
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
                      htmlFor="company-website"
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
                      htmlFor="company-website"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}
