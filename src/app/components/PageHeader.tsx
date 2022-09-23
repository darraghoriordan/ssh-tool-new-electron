import * as React from 'react'

export class PageHeaderProps {
  pageTitle!: string
  children?: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="xl:flex xl:items-center xl:justify-between mb-4">
      <div className="min-w-0 flex-1">
        <h2 className="font-bold text-gray-900 text-4xl">{props.pageTitle}</h2>
      </div>
      <div className="flex space-x-2 mt-4 xl:mt-0">{props.children}</div>
    </div>
  )
}

export default PageHeader
