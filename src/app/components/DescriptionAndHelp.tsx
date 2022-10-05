import { Disclosure } from '@headlessui/react'
import {
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import React from 'react'

export const DescriptionAndHelp = (
  props: {
    faqs: { id: number; question: string; answer: string }[]
    title?: string
  } & React.PropsWithChildren
) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="mb-6">
          <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-indigo-400 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
            <span className="flex">
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />{' '}
              {props.title || 'Description and FAQ'}{' '}
            </span>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-white`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-4 overflow-auto bg-white shadow sm:rounded-lg">
            <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
              {props.faqs.map(faq => (
                <div key={faq.id}>
                  <dt className="text-lg font-medium text-gray-900 leading-6">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}
