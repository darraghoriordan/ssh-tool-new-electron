import * as React from 'react'

export class PageHeaderProps {
  pageTitle!: string
  children?: React.ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="lg:flex lg:items-center lg:justify-between bg-gray-800">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl lg:ml-4 lg:my-4">
          {props.pageTitle}
        </h2>
      </div>

      <div className="flex mx-4 ml-4 mr-12 pb-4 pb-0">{props.children}</div>
    </div>
  )
}

export default PageHeader
