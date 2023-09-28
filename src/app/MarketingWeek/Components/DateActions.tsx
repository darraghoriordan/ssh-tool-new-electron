/* eslint-disable react/jsx-no-duplicate-props */
import { Dialog, Transition } from '@headlessui/react'
import {
  CommandLineIcon,
  LinkIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { IncrementAnalysis } from '../../../electron/devHistory/models/IncrementAnalysis'
import { colorMap } from './colorMap'
import {
  BrowserHistoryEntry,
  GitCommitHistoryEntry,
} from '../../../electron/devHistory/models/HistoryEntry'
import { format } from 'date-fns'

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
  const nowInTwitterFormat = format(new Date(), 'h:mm a · MMM d, yyyy')
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
                      <details>
                        <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
                          Generated Blog Posts
                        </summary>

                        {increment?.raw.analysis?.blogPosts?.map(
                          (post, index) => {
                            return (
                              <Fragment key={index}>
                                <h3 className="my-4 mt-4 text-sm font-semibold text-gray-900 leading-6">
                                  Blog Post {index + 1}
                                </h3>
                                <pre
                                  className="whitespace-pre-wrap"
                                  key={index}
                                >
                                  {post.text}
                                </pre>
                              </Fragment>
                            )
                          },
                        )}
                      </details>
                    </div>
                    <div className="relative px-4 sm:px-6">
                      <details>
                        <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
                          Generated Tweets / Social Posts
                        </summary>
                        <div className="grid grid-cols-2 gap-2">
                          {increment?.raw.analysis?.tweets?.map(
                            (post, index) => {
                              return (
                                <div
                                  key={index}
                                  className="max-w-xl p-4 bg-white border border-gray-200 col-span-1 dark:bg-gray-800 dark:border-gray-800 rounded-xl"
                                >
                                  <div className="flex justify-between">
                                    <div className="flex items-center">
                                      <UserCircleIcon className="rounded-full h-11 w-11" />
                                      <div className="text-xs leading-tight ml-1.5">
                                        <span className="block font-bold text-black dark:text-white">
                                          Marketing Week
                                        </span>

                                        <span className="block font-normal text-gray-500 dark:text-gray-400">
                                          @marketingWeek
                                        </span>
                                      </div>
                                    </div>
                                    <svg
                                      className="inline-block w-auto h-6 text-blue-400 fill-current dark:text-white"
                                      viewBox="0 0 24 24"
                                    >
                                      <g>
                                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                                      </g>
                                    </svg>
                                  </div>
                                  <p className="block mt-3 text-lg leading-snug text-black dark:text-white">
                                    {post.text}
                                  </p>

                                  <p className="py-1 text-sm text-gray-500 dark:text-gray-400 my-0.5">
                                    {nowInTwitterFormat}
                                  </p>
                                  <div className="my-1 border border-b-0 border-gray-200 dark:border-gray-600"></div>
                                  <div className="flex mt-3 text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center mr-6">
                                      <svg
                                        className="w-auto h-5 fill-current"
                                        viewBox="0 0 24 24"
                                        // className="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                        style={{}}
                                      >
                                        <g>
                                          <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                                        </g>
                                      </svg>
                                      <span className="ml-3">615</span>
                                    </div>
                                    <div className="flex items-center mr-6">
                                      <svg
                                        className="w-auto h-5 fill-current"
                                        viewBox="0 0 24 24"
                                        // className="r-1re7ezh r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"
                                      >
                                        <g>
                                          <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                                        </g>
                                      </svg>
                                      <span className="ml-3">
                                        93 people are Tweeting about this
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )

                              //   return <pre key={index}>{post.text}</pre>
                            },
                          )}
                        </div>
                      </details>
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
