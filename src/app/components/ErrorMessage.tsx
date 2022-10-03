import { XCircleIcon } from '@heroicons/react/24/outline'

export class ErrorMessageProps {
  title!: string
  list!: string[]
}
export const ErrorMessage = (props: ErrorMessageProps) => {
  return (
    <div className="p-4 rounded-md bg-red-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{props.title}</h3>
          <div className="mt-2 text-sm text-red-700">
            {props.list && (
              <ul className="pl-5 list-disc space-y-1">
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
