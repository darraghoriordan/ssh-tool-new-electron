import { Console } from './ConsoleArea/Console'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarMenu } from './components/SidebarMenu'
import { useFirstRunRedirect } from './Onboarding/hooks'

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
      <div className="justify-between h-screen pl-64">
        <div className="pt-8 overflow-y-scroll h-4/5">
          <main className="mx-8 mb-auto min-h-10">
            <Outlet />
          </main>
        </div>
        <div className="overflow-y-hidden h-1/5">
          <Console />
        </div>
      </div>
    </div>
  )
}
