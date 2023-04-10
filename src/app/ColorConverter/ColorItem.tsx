/* eslint-disable jsx-a11y/no-static-element-interactions */

import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

/* eslint-disable jsx-a11y/click-events-have-key-events */
export type ColorItemProps = {
  title: string
  colorValue: string
  clipValue: (value: string) => void
  clipColor: string
}
const ColorItem = (props: ColorItemProps) => {
  return (
    <div className="items-center justify-between space-y-2">
      <p className="block text-lg">
        <span className="font-light">{props.title} &mdash; </span>{' '}
        {props.clipColor}
      </p>
      <div
        title={`Click to copy ${props.clipColor}`}
        onClick={() => props.clipValue(props.clipColor)}
        className={`hover:cursor-pointer h-[100px] w-[200px] flex justify-end items-start rounded-md`}
        style={{ backgroundColor: props.colorValue }}
      >
        <ClipboardDocumentCheckIcon className="h-6 w-6 p-1 bg-white rounded-md border border-black"></ClipboardDocumentCheckIcon>
      </div>
    </div>
  )
}

export default ColorItem
