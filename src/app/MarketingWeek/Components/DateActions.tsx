import { Dialog, Transition } from '@headlessui/react'
import {
  CommandLineIcon,
  LinkIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { IncrementAnalysis } from '../../../electron/devHistory/models/IncrementAnalysis'
import { colorMap } from './colorMap'

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
                    <div className="relative flex-1 px-4 py-6 mt-4 border-t sm:px-6">
                      <details>
                        <summary>
                          {increment?.raw.analysis?.summary?.text}
                        </summary>
                        <ul className="mt-4">
                          {increment?.raw.events.map((e, index) => {
                            if (e.type === 'browser history') {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const urlMeta = e.metadata
                              return (
                                <li key={urlMeta.url} className="list-inside">
                                  <LinkIcon className="inline w-4 h-4 mr-2 text-gray-200  dark:text-gray-600 fill-blue-600" />
                                  <a
                                    href={urlMeta.url}
                                    target="_blank"
                                    title={urlMeta.url}
                                    rel="noreferrer"
                                  >
                                    {urlMeta.title}
                                  </a>
                                </li>
                              )
                            } else if (e.type === 'git commit') {
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              const gitMeta = e.metadata
                              return (
                                <li
                                  key={gitMeta.message + index}
                                  className="list-inside"
                                >
                                  <CommandLineIcon className="inline w-4 h-4 mr-2 text-gray-200  dark:text-gray-600 fill-blue-600" />
                                  <p className="inline">{gitMeta.message}</p>
                                </li>
                              )
                            }
                          })}
                        </ul>
                      </details>
                    </div>
                    <div className="relative flex-1 px-4 mt-6 sm:px-6">
                      {/* Your content */}
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
