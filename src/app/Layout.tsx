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
    <div>
      <div className="fixed inset-y-0 z-50 flex w-64 bg-gray-800">
        <SidebarMenu />
      </div>
      <div className="">
        <div className="pl-64 pb-44">
          <main className="pt-8 mx-8 mb-auto">
            <Outlet />
          </main>
        </div>

        <div className="fixed bottom-0 right-0 w-full pl-64 max-h-[18vh]">
          <Console />
        </div>
      </div>
    </div>
  )
}
