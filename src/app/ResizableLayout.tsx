import { Console } from './ConsoleArea/Console'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarMenu } from './components/SidebarMenu'
import { useFirstRunRedirect } from './Onboarding/hooks'
import { Panel, PanelGroup } from 'react-resizable-panels'
import ResizeHandle from './components/ResizeHandle'

export const Layout = () => {
  const { isError, isLoading, error } = useFirstRunRedirect()

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError && error) {
    return <div> {error.message}</div>
  }

  return (
    <PanelGroup direction="horizontal" className="overflow-scroll h-[100vh]">
      <Panel
        defaultSize={15}
        minSize={15}
        maxSize={20}
        className="bg-dark-shade h-screen overflow-auto"
        style={{ display: 'flex' }}
        // className="fixed inset-y-0 z-50 flex w-64 bg-gray-800"
      >
        <SidebarMenu />
      </Panel>
      <ResizeHandle className="bg-dark-shade" />
      <Panel defaultSize={80}>
        <PanelGroup direction="vertical" className="">
          <Panel defaultSize={80}>
            <Outlet />
          </Panel>
          <ResizeHandle className="bg-neutral-600" />
          <Panel defaultSize={20} className="flex">
            <Console />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  )
}
