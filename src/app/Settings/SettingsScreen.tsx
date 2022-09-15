/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { SettingsResponse } from '../../electron/appSettings/MessageTypes'
import { ApplicationSettings } from '../../electron/appSettings/ApplicationSettings'
import { useForm } from 'react-hook-form'

export function SettingsScreen() {
  const [loadingData, setLoadingData] = useState(true)
  const { register, handleSubmit } = useForm()
  const [loadedData, setLoadDataResponse] = useState<SettingsResponse>({
    isInError: false,
    errorMessage: undefined,
    settings: new ApplicationSettings(),
  })

  useEffect(() => {
    window.LoadSettings.invoke().then((settingsResponse: SettingsResponse) => {
      console.log(settingsResponse)
      setLoadDataResponse(settingsResponse)
      setLoadingData(false)
    })
  }, [])

  const handleSaveSettingsClick = async (settings: ApplicationSettings) => {
    setLoadingData(true)
    await window.SaveSettings.invoke({ settings })
    setLoadingData(false)
  }
  if (loadingData) {
    return <>Loading...</>
  }
  //   return (
  //     <>
  //       <PageHeader pageTitle={'Settings'}></PageHeader>
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
  //         This is a test
  //         <form
  //           onSubmit={handleSubmit(data =>
  //             handleSaveSettingsClick({
  //               sshCertPath: data['sshCertPath']!,
  //               projectsPath: data['projectsPath']!,
  //             })
  //           )}
  //         >
  //           <input
  //             {...register('sshCertPath')}
  //             value={loadedData.settings.sshCertPath}
  //           />
  //           <input
  //             {...register('projectsPath')}
  //             value={loadedData.settings.projectsPath}
  //           />

  //           <input type="submit" />
  //         </form>
  //         This is a test
  //       </div>
  //     </>
  //   )

  return (
    <>
      <PageHeader pageTitle={'Settings'}></PageHeader>
      <form
        className="space-y-6"
        action="#"
        method="POST"
        onSubmit={handleSubmit(data =>
          handleSaveSettingsClick({
            sshCertPath: data['sshCertPath']!,
            projectsPath: data['projectsPath']!,
          })
        )}
      >
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
                      value={loadedData.settings.sshCertPath}
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
                      value={loadedData.settings.projectsPath}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </form>
    </>
  )
}
