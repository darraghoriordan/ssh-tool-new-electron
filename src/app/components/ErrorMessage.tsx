import { XCircleIcon } from '@heroicons/react/24/outline'

export class ErrorMessageProps {
  title!: string
  list!: string[]
}
export const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{props.title}</h3>
          <div className="mt-2 text-sm text-red-700">
            {props.list && (
              <ul role="list" className="list-disc pl-5 space-y-1">
                {props.list.map((li: string, index: number) => {
                  return <li key={index}>li</li>
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
