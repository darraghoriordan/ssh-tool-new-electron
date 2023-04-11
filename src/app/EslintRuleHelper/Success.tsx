import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function Success() {
  return (
    <div className="p-4 rounded-md bg-green-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="w-5 h-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Successful generation
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>
              There were no errors! The AI assissant was able to generate code
              and it passed all of your test cases. You can now use the code in
              an eslint plugin.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
