import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Fragment } from 'react'

/* eslint-disable jsx-a11y/anchor-is-valid */
export function TimeScaleMenu() {
  return (
    <div className=" md:ml-4 md:flex md:items-center">
      <Menu as="div" className="relative">
        <Menu.Button
          type="button"
          className="flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white gap-x-1.5 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Day view
          <ChevronDownIcon
            className="w-5 h-5 -mr-1 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-3 overflow-hidden bg-white shadow-lg w-36 origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Day view
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Week view
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Month view
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Year view
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <div className="w-px h-6 ml-6 bg-gray-300" />
      <button
        type="button"
        className="px-3 py-2 ml-6 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Add event
      </button>
    </div>
  )
}
