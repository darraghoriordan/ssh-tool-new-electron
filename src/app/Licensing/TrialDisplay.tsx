import { LicenseDataDto } from '../../electron/licencing/models/LicenseDataDto'

export const TrialDisplay = (props: { licence: LicenseDataDto }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900 leading-6">
          Trial License
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          14 days free-trial license.
        </p>
      </div>
      <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Remaining days in Trial
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {props.licence.trialRemainingDays}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
