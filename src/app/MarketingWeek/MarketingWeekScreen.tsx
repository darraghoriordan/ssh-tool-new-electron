/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext } from 'react'
import PageHeader from '../components/PageHeader'
import {
  AtSymbolIcon,
  FolderOpenIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline'
import { useDevHistoryGetDay } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import Calendar from './Calendar'
import { DiscreteDayNav } from './Components/DiscreteDayNav'
import DateActions from './Components/DateActions'
import { IncrementAnalysis } from '../../electron/marketingWeek/models/IncrementAnalysis'
import { timeOfDayMatchesToSecond } from '../../electron/marketingWeek/services/time-wrangler'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'

const faqs = [
  {
    id: 1,
    question: 'What is this tool for?',
    answer:
      'Marketing week is for people who build products. Product builders should alternate between a week of building and a week of marketing. This tool helps you plan your marketing week.',
  },
  {
    id: 2,
    question: 'Why use it?',
    answer:
      'It can be difficult to remember all the awesome things you did for your product. Builders often find it hard to find things to say about their work. This tool uses AI to automatically process your work to generate drafts and ideas for engaging content for your audience.',
  },
  {
    id: 3,
    question: 'How does it work?',
    answer:
      "Based on the configuration you provided for your Git repositories and other tools, this tool will scan your work and with OpenAI's products, it will compile summaries of what you achieved.",
  },
  {
    id: 4,
    question: 'Privacy notice',
    answer:
      'This tool IS NOT LOCAL. It will send your data to Open AI for processing. Browser history for the configured Chrome profile and raw Git commit diffs will be processed by Open AI.',
  },
]

export function MarketingWeekScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [isDateActionsOpen, setOpenDateActions] = React.useState(false)
  const { data, isLoading } = useDevHistoryGetDay({ date: selectedDate })

  const [selectedIncrement, setSelectedIncrement] = React.useState<
    IncrementAnalysis | undefined
  >(data?.analysis?.[0])
  let control: ReactElement | undefined = undefined

  const allBlogPosts = data?.analysis.reduce(
    (acc, cur) => {
      return acc.concat(cur?.raw?.analysis?.blogPosts || [])
    },
    [] as { text: string }[],
  )
  const allSocialPosts = data?.analysis.reduce(
    (acc, cur) => {
      return acc.concat(cur?.raw?.analysis?.tweets || [])
    },
    [] as { text: string }[],
  )
  const onOpenFolderClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    logAMessage({ level: 'info', message: `Opening folder ${location}` })
    window.OpenDevHistoryCacheLocation.invoke()
  }

  control = (
    <div className="flex flex-col h-[86%]">
      <header className="flex items-center justify-between flex-none py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div>
            <h2 className="text-base font-semibold text-gray-900 leading-6">
              <time dateTime={selectedDate.toUTCString()} className="sm:hidden">
                {selectedDate.toLocaleDateString()}
              </time>
              <time
                dateTime={selectedDate.toUTCString()}
                className="hidden sm:inline"
              >
                {selectedDate.toLocaleDateString()}
              </time>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: 'long',
              })}
            </p>
          </div>
          <div className="justify-between ml-8 text-sm">
            <div className="flex items-center">
              <AtSymbolIcon className="w-4 h-4 mr-3" />{' '}
              {allSocialPosts?.length || '-'} Draft Tweets/Posts
            </div>
            <div className="flex items-center">
              <PencilSquareIcon className="w-4 h-4 mr-3" />{' '}
              {allBlogPosts?.length || '-'} Draft Blog Posts
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {isLoading ? (
            <div role="status" className="mx-12 min-w-1/4 grow">
              <span className="text-xs">
                Please wait! This looks like a day that hasn&apos;t been
                processed or there is new activity. It could take{' '}
                <span className="font-semibold">3-4 minutes or more</span> to
                pass an entire day through AI!
              </span>{' '}
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : null}
          <DiscreteDayNav
            date={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>
      </header>
      <DateActions
        open={isDateActionsOpen}
        setOpen={setOpenDateActions}
        increment={
          selectedIncrement?.increment.startDate &&
          data?.analysis.find(x =>
            timeOfDayMatchesToSecond(
              x.increment.startDate,
              selectedIncrement?.increment.startDate,
            ),
          )
        }
      />
      <Calendar
        date={selectedDate}
        analysis={data?.analysis || []}
        setSelectedIncrement={setSelectedIncrement}
        setOpenDateActions={setOpenDateActions}
        setSelectedDate={setSelectedDate}
        allBlogPosts={allBlogPosts || []}
        allSocialPosts={allSocialPosts || []}
      />
    </div>
  )
  return (
    <ScreenWrapper>
      <PageHeader pageTitle={'Marketing Week'}>
        <button
          onClick={e => onOpenFolderClick(e)}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <FolderOpenIcon className="w-5 h-5 mr-2" />
          Open cache data folder...
        </button>
      </PageHeader>
      <DescriptionAndHelp
        title="Description and FAQ (Please Read!!)"
        faqs={faqs}
      />
      {control}
    </ScreenWrapper>
  )
}