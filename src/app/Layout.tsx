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
      <div className="fixed inset-y-0 flex w-64 bg-gray-800">
        <SidebarMenu />
      </div>
      <div className="flex flex-col h-screen pl-64">
        <div className="overflow-y-scroll h-4/5 max-h-4/5">
          <main className="pt-8 mx-8 mb-auto min-h-10">
            <Outlet />
          </main>
        </div>
        <div className="flex items-center h-6 text-white border-t-2 border-b-2 bg-neutral-800 border-neutral-600 w-100">
          <CommandLineIcon className="w-4 h-4 text-white" aria-hidden="true" />
          <span className="ml-2 font-mono">console</span>
        </div>
        <div className="overflow-auto h-1/5 max-h-1/5">
          <Console />
        </div>
      </div>
    </div>
  )
}
