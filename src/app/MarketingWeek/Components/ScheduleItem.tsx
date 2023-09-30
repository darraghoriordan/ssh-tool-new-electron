/* eslint-disable jsx-a11y/anchor-is-valid */
import { AtSymbolIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { IncrementAnalysis } from '../../../electron/marketingWeek/models/IncrementAnalysis'
import { colorMap, defaultColor } from './colorMap'

export function ScheduledItem({
  item,
  onClick,
}: {
  item: IncrementAnalysis
  onClick: () => void
}) {
  const cat = item.raw.analysis?.summary?.category || 'other'
  const text = item.summary
  const hasBlogPosts = item.raw.analysis?.blogPosts?.length || 0
  const hasTweets = item.raw.analysis?.tweets?.length || 0
  const color = colorMap.get(cat) || defaultColor

  return (
    <button
      onClick={onClick}
      className={`absolute p-2 overflow-y-auto text-xs rounded-lg group inset-1 ${color.textDark} ${color.bg} leading-5 ${color.bgDark}`}
    >
      <div className="inline-flex items-center gap-x-2">
        <p className={`font-semibold`}>{`[ ${cat}`}</p>
        {hasBlogPosts ? (
          <PencilSquareIcon
            title="click to view blog posts"
            className="w-3 h-3"
          />
        ) : null}
        {hasTweets ? (
          <AtSymbolIcon title="click to view tweets" className="w-3 h-3" />
        ) : null}
        <p className={`font-semibold`}>{'] - '}</p>
      </div>
      <span className={`${color.text} ${color.hoverTextDark} inline`}>
        {text}
      </span>
    </button>
  )
}
