import { Dialog, Transition } from '@headlessui/react'
import { CommandLineIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

export class OnboardingDialogProps {
  closed!: boolean
  setClosed!: (closed: boolean) => void
}
export default function OnboardingDialog(props: OnboardingDialogProps) {
  return (
    <Transition.Root show={!props.closed} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          props.setClosed(true)
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-pink-300 rounded-full">
                    <CommandLineIcon
                      className="w-6 h-6 text-blue-500"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium text-gray-900 leading-6"
                    >
                      Welcome to Local Dev Tools
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="mb-4 text-sm text-gray-500">
                        It looks like this is your first time running the
                        application on this machine.{' '}
                      </p>
                      <p className="mb-2 text-sm text-gray-500">
                        You should visit the settings page and verify that the
                        default paths match your development setup.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => {
                      props.setClosed(true)
                    }}
                  >
                    Go to the settings page now
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
