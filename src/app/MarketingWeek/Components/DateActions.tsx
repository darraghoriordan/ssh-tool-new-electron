/* eslint-disable react/jsx-no-duplicate-props */
import { Dialog, Transition } from '@headlessui/react'
import {
  CommandLineIcon,
  LinkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { IncrementAnalysis } from '../../../electron/devHistory/models/IncrementAnalysis'
import { colorMap } from './colorMap'
import {
  BrowserHistoryEntry,
  GitCommitHistoryEntry,
} from '../../../electron/devHistory/models/HistoryEntry'
import { SocialPostsDetailsSummary } from './SocialPostsDetailsSummary'
import { BlogPostsDetailsSummary } from './BlogPostsDetailsSummary'

export default function DateActions({
  open,
  setOpen,
  increment,
}: {
  open: boolean
  increment: IncrementAnalysis | undefined
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const colors = colorMap.get(
    increment?.raw.analysis?.summary?.category || 'other',
  )

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-6xl pointer-events-auto">
                  <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold text-gray-900 leading-6">
                          {increment?.increment.startDate.toLocaleTimeString() +
                            ' - ' +
                            increment?.increment.endDate.toLocaleTimeString()}
                        </Dialog.Title>
                        <div className="flex items-center ml-3 h-7">
                          <button
                            type="button"
                            className="relative text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 mr-auto sm:px-6">
                      <span
                        className={`inline-flex items-center text-xs font-medium ${colors?.bg}  ${colors?.textDark} gap-x-1.5 rounded-md px-1.5 py-0.5`}
                      >
                        <svg
                          className={`h-1.5 w-1.5 ${colors?.pillFill}`}
                          viewBox="0 0 6 6"
                          aria-hidden="true"
                        >
                          <circle cx={3} cy={3} r={3} />
                        </svg>
                        {increment?.raw.analysis?.summary?.category || 'other'}
                      </span>
                    </div>
                    <div className="relative px-4 mt-4 border-t sm:px-6">
                      <h2 className="my-4 text-lg font-semibold text-gray-900 leading-6">
                        Summary
                      </h2>
                      {increment?.raw.analysis?.summary?.text}
                      <details>
                        <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
                          All Event Details
                        </summary>
                        <h3 className="mt-4 text-sm font-semibold text-gray-900 leading-6">
                          Browsing History
                        </h3>
                        <ul className="mt-4">
                          {increment?.raw.events
                            .filter(e => e.type === 'browser history')
                            .map((e, index) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const urlMeta = (e as BrowserHistoryEntry)
                                .metadata
                              return (
                                <li
                                  key={urlMeta.url + index}
                                  className="list-inside"
                                >
                                  <LinkIcon className="inline w-4 h-4 mr-2 text-gray-200  dark:text-gray-600 fill-blue-600" />
                                  <a
                                    href={urlMeta.url}
                                    className="underline underline-offset-2"
                                    target="_blank"
                                    title={urlMeta.url}
                                    rel="noreferrer"
                                  >
                                    {urlMeta.title}
                                  </a>
                                </li>
                              )
                            })}
                        </ul>
                        <h3 className="mt-4 text-sm font-semibold text-gray-900 leading-6">
                          Coding History
                        </h3>
                        <ul className="mt-4">
                          {increment?.raw.events
                            .filter(e => e.type === 'git commit')
                            .map((e, index) => {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const gitMeta = (e as GitCommitHistoryEntry)
                                .metadata
                              return (
                                <li
                                  key={gitMeta.message + index}
                                  className="list-inside"
                                >
                                  <CommandLineIcon className="inline w-4 h-4 mr-2 text-gray-200  dark:text-gray-600 fill-blue-600" />
                                  <p className="inline">{gitMeta.message}</p>
                                </li>
                              )
                            })}
                        </ul>
                      </details>
                    </div>
                    <div className="relative px-4 sm:px-6">
                      <BlogPostsDetailsSummary
                        blogPosts={increment?.raw.analysis?.blogPosts || []}
                      />
                    </div>
                    <div className="relative px-4 sm:px-6">
                      <SocialPostsDetailsSummary
                        tweets={increment?.raw.analysis?.tweets || []}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
