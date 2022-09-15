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
  return (
    <>
      <PageHeader pageTitle={'Settings'}></PageHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        This is a test
        <form
          onSubmit={handleSubmit(data =>
            handleSaveSettingsClick({
              sshCertPath: data['sshCertPath']!,
              projectsPath: data['projectsPath']!,
            })
          )}
        >
          <input
            {...register('sshCertPath')}
            value={loadedData.settings.sshCertPath}
          />
          <input
            {...register('projectsPath')}
            value={loadedData.settings.projectsPath}
          />

          <input type="submit" />
        </form>
        This is a test
      </div>
    </>
  )
}
