import { UserCircleIcon } from '@heroicons/react/24/outline'
import clap from './clap.svg'
import heart from './heart.svg'
import thumb from './thumbup.svg'

export function LinkedInPost({ text }: { text: string }) {
  return (
    // <div className="flex items-center justify-center w-screen h-screen p-3 bg-gray-100">
    <div className="max-w-lg px-4 py-3 bg-white border rounded-lg shadow-sm">
      <div className="flex items-center">
        <UserCircleIcon className="w-12 h-12 rounded-full" />
        <div className="ml-2">
          <div className="text-sm ">
            <span className="font-semibold">Marketing Week</span>
            <span className="text-gray-500"> • 1st</span>
          </div>
          <div className="text-xs text-gray-500">
            Software Engineer at Marketing Week, Inc
          </div>
          <div className="flex text-xs text-gray-500">
            <span className="inline-block">3d • Edited • </span>
            <svg
              className="inline-block ml-1 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              data-supported-dps="16x16"
              fill="currentColor"
              width="16"
              height="16"
              focusable="false"
            >
              <path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z"></path>
            </svg>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm leading-normal text-gray-800 md:leading-relaxed">
        {text}
      </p>
      <div className="flex items-center mt-3 text-xs text-gray-500">
        <img className="mr-0.5" alt="linkedin icon" src={thumb} />
        <img className="mr-0.5" alt="linkedin icon" src={clap} />
        <img className="mr-0.5" alt="linkedin icon" src={heart} />
        <span className="ml-1">47 • 26 comments</span>
      </div>
    </div>
    // </div>
  )
}
