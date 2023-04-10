import ColorItem from './ColorItem'

export type ColorDataItemProps = {
  clipValue: (value: string) => void
  colors: string[]
  label: string
}
export const HarmonyColorsSet = (props: ColorDataItemProps) => {
  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{props.label}</dt>
      <dd className="flex space-x-4 flex-wrap items-center mt-1 text-sm font-medium text-gray-900 sm:col-span-2 sm:mt-0">
        {props.colors.map((color, index) => (
          <ColorItem
            key={`${color}-${index}`}
            clipColor={color}
            clipValue={props.clipValue}
            colorValue={color}
            title={`Color ${index + 1}`}
          />
        ))}
      </dd>
    </div>
  )
}
