import { XCircleIcon } from '@heroicons/react/20/solid'
import EslintRuleTestingError from '../../electron/eslintRuleHelper/models/EslintRuleTestingError'

export default function Errors({
  errors,
}: {
  errors: EslintRuleTestingError[]
}) {
  return (
    <div className="p-4 rounded-md bg-red-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            There were errors in this epoch
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="pl-5 list-disc space-y-1">
              {errors.map((e, i) => {
                return (
                  <>
                    <li key={i}>
                      <span className="font-semibold">{e.source} error:</span>{' '}
                      {e.message}
                    </li>
                    {!e.recoverable ? (
                      <li key={i + e.source}>
                        This is an error with the generation flow. The AI
                        assistant won&apos;t be able to generate code to fix
                        this, generation will be cancelled for any remaining
                        epochs to save your tokens.
                      </li>
                    ) : (
                      <li key={i + 'system'}>
                        The AI assistant will try to fix this error and continue
                        in the next Epoch.
                      </li>
                    )}
                  </>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
