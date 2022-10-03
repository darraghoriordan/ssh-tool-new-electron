import { Console } from './ConsoleArea/Console'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarMenu } from './components/SidebarMenu'
import { useFirstRunRedirect } from './Onboarding/hooks'
import { CommandLineIcon } from '@heroicons/react/24/outline'

export const Layout = () => {
  const { isError, isLoading, error } = useFirstRunRedirect()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError && error) {
    return <div> {error.message}</div>
  }

  return (
    <div className="">
      <div className="fixed inset-y-0 z-50 flex w-64 bg-gray-800">
        <SidebarMenu />
      </div>
      <div className="">
        <div className="h-screen pl-64 overflow-auto pb-44">
          <main className="pt-8 mx-8 mb-auto ">
            <Outlet />
          </main>
        </div>

        <div className="absolute bottom-0 right-0 w-full pl-64">
          <Console />
        </div>
      </div>
    </div>
  )
}
