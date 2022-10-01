import { Console } from './ConsoleArea/Console'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarMenu } from './components/SidebarMenu'
import { useStartupRedirects } from './Onboarding/hooks'

export const Layout = () => {
  const { isError, isLoading, error } = useStartupRedirects()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError && error) {
    return <div> {error.message}</div>
  }

  return (
    <div className="">
      <div className="flex w-64 fixed inset-y-0 bg-gray-800">
        <SidebarMenu />
      </div>
      <div className="pl-64 h-screen justify-between">
        <div className="pt-8 overflow-y-scroll h-4/5">
          <main className="mx-8 mb-auto min-h-10">
            <Outlet />
          </main>
        </div>
        <Console />
      </div>
    </div>
  )
}
