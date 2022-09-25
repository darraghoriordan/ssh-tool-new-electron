import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
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
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-indigo-400 px-4 py-2 text-left text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-75">
            <span>{props.title || 'Description and FAQ'} </span>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } h-5 w-5 text-white`}
            />
          </Disclosure.Button>
          <Disclosure.Panel className="bg-white shadow overflow-auto sm:rounded-lg px-4 py-4">
            <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
              {props.faqs.map(faq => (
                <div key={faq.id}>
                  <dt className="text-lg font-medium leading-6 text-gray-900">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
