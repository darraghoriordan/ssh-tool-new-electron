import { CommandLineIcon } from '@heroicons/react/24/outline'
import React, { useEffect } from 'react'

import { Outlet, useNavigate } from 'react-router-dom'

import { useGetAppSettings } from './AppSettings/ReactQueryWrappers'
import { SidebarMenu } from './components/SidebarMenu'
export type LogMessage = {
  level: 'info' | 'warn' | 'error'
  message: string
}
const sampleText = [] as LogMessage[]
sampleText.push({ level: 'error', message: 'something happened' })
sampleText.push({
  level: 'info',
  message: `this
is
fsfsfsdfkkkkkkkksfsfsdfkkkkkkkksfsfsdfkkkkkkkksfsfsdfkkkkkkkksfsfsdfkkkkkkkkdsfsfsdfkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
sdfsdf
sdfsdfsdf
sdfsdf`,
})
sampleText.push({ level: 'error', message: 'something happened' })

sampleText.push({ level: 'error', message: 'something happened' })

sampleText.push({ level: 'warn', message: 'this is a warning' })
sampleText.push({ level: 'warn', message: 'this is a warning' })
sampleText.push({ level: 'warn', message: 'this is a warning' })
sampleText.push({ level: 'error', message: 'something happened' })

sampleText.push({ level: 'error', message: 'something happened' })

export const Layout = () => {
  const {
    isLoading: isLoadingGetAppSettings,
    data: appSettingsData,
    error: getAppSettings,
  } = useGetAppSettings()
  const navigateRoute = useNavigate()
  // REDIRECT IF FIRST TIME USED!
  useEffect(() => {
    if (
      appSettingsData &&
      appSettingsData.storedApplicationSettings.firstRunDate === undefined
    ) {
      console.log(
        `redirecting to onboarding. First run is: ${appSettingsData.storedApplicationSettings.firstRunDate}`
      )
      navigateRoute('/onboarding') // change to welcome screen
    }
  }, [appSettingsData, navigateRoute])

  if (getAppSettings) {
    return <>Error...{getAppSettings.message}</>
  }
  if (isLoadingGetAppSettings) {
    return <>Loading...</>
  }

  return (
    <div className="">
      <div className="flex w-64 fixed inset-y-0 bg-gray-800">
        <SidebarMenu />
      </div>
      <div className="pl-64 flex flex-col h-screen justify-between">
        <div className="pt-8 overflow-y-scroll">
          <main className="mx-8 mb-auto min-h-10">
            <Outlet />
          </main>
        </div>

        <div className="bg-gray-200 h-1/5 break-all">
          <div className="bg-gray-800 text-white border-t-2 border-b-2 pl-4 flex items-center">
            <CommandLineIcon
              className="h-4 w-4 text-white"
              aria-hidden="true"
            />{' '}
            <span className="font-mono ml-2">console</span>
          </div>
          <pre
            className="pl-1 pt-1 text-sm whitespace-normal overflow-y-scroll  h-full align-top font-mono max-w-100 "
            aria-readonly={true}
            aria-label="message console"
          >
            {sampleText.map((x, i) => {
              const message = `[${x.level.toUpperCase()}] $> ${x.message}`

              switch (x.level) {
                case 'error':
                  return (
                    <code key={i} className="text-red-600">
                      {message}
                      <br />
                    </code>
                  )

                case 'warn':
                  return (
                    <code key={i} className="text-orange-400">
                      {message}
                      <br />
                    </code>
                  )
                default:
                  return (
                    <code key={i} className="">
                      {message}
                      <br />
                    </code>
                  )
              }
            })}
          </pre>
          {/* Content goes here */}
          {/* We use less vertical padding on card footers at all sizes than on headers or body sections */}
        </div>
      </div>
    </div>
  )
}
