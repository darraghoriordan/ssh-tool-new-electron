import { LicenseDataDto } from '../../electron/licencing/models/LicenseDataDto'

export const LicenseDisplay = (props: { licence: LicenseDataDto }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
          Paid License
        </h2>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          {props.licence.licenseTermSentence}
        </p>
      </div>
      <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">License key</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {props.licence.licenseKey}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Licensed to</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {props.licence.licensedUserEmail}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              License Created On
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {props.licence.licenceCreatedDate?.toLocaleDateString()}
            </dd>
          </div>
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Remaining days of paid updates
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {props.licence.paidUpdatesRemainingDays}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
