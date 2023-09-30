import { PropsWithChildren } from 'react'

export function ScreenWrapper({ children }: PropsWithChildren) {
  return (
    <div className="h-full pt-2 pr-8 ml-8 mr-auto overflow-y-auto max-w-[100rem]">
      {children}
    </div>
  )
}
