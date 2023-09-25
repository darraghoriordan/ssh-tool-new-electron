/* eslint-disable jsx-a11y/anchor-is-valid */
import { CategoryEnum } from '../../../electron/devHistory/services/openai-service'
import { colorMap, defaultColor } from './colorMap'

export function ScheduledItem({
  item,
}: {
  item: { category: CategoryEnum; text: string }
}) {
  const color = colorMap.get(item.category) || defaultColor
  return (
    <>
      <a
        href="#"
        className={`absolute flex flex-col p-2 overflow-y-auto text-xs rounded-lg group inset-1 ${color.bg} leading-5 ${color.bgDark}`}
      >
        {/* <p className={`order-1 font-semibold ${color.textDark}`}>
          {item.category}
        </p> */}
        <p className={`order-1 ${color.text} ${color.hoverTextDark}`}>
          <span className={`font-semibold ${color.textDark}`}>
            {'[ '}
            {item.category} {' ] - '}
          </span>
          {item.text}
        </p>
      </a>
    </>
  )
}
