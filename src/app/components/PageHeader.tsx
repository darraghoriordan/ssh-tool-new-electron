import * as React from 'react'

export class PageHeaderProps {
  pageTitle!: string
  children?: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="mb-4 xl:flex xl:items-center xl:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-4xl font-bold text-gray-900">{props.pageTitle}</h2>
      </div>
      <div className="flex items-center mt-4 space-x-2 xl:mt-0">
        {props.children}
      </div>
    </div>
  )
}

export default PageHeader
