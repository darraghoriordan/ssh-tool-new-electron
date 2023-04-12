import { BoltIcon } from '@heroicons/react/24/solid'
import { EslintRuleEpoch } from '../../electron/eslintRuleHelper/models/EslintRuleEpoch'

export default function InProgress({ epoch }: { epoch: EslintRuleEpoch }) {
  let title = 'In Progress'
  if (epoch.tokensUsed > 0 && !epoch.completed) {
    title = `Testing the code with ESLint`
  }
  if (epoch.tokensUsed === 0 && !epoch.completed) {
    title = `AI is generating your code`
  }
  return (
    <div className="p-4 rounded-md bg-blue-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <BoltIcon className="w-5 h-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">{title}</h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              This epoch is still in progress. An Epoch usually takes 20-30
              seconds to run through the steps of AI generation, code cleanup
              and Eslint rule testing. Sometimes there are catastrophic errors
              that prevent this status from updating, but please have patience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
