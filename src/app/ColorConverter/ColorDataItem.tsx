import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

export type ColorDataItemProps = {
  clipValue: (value: string) => void
  value: string | undefined
  label: string
}
export const ColorDataItem = (props: ColorDataItemProps) => {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{props.label}</dt>
      <dd className="flex items-center mt-1 text-sm font-medium text-gray-900 sm:col-span-2 sm:mt-0">
        {props.value}{' '}
        {props.value && (
          <ClipboardDocumentCheckIcon
            onClick={() => props.clipValue(props.value || '')}
            title="click to copy to clipboard"
            className="w-5 h-5 ml-2 hover:cursor-pointer"
          />
        )}
      </dd>
    </div>
  )
}
