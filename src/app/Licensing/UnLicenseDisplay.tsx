import { LicenseDataDto } from '../../electron/licencing/models/LicenseDataDto'
import React from 'react'

export const UnLicenseDisplay = (props: { licence: LicenseDataDto }) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900 leading-6">
          No License
        </h3>
        <p className="max-w-2xl mt-1 text-sm text-gray-500">
          The license found is not valid
        </p>
      </div>
      <div className="px-4 border-t border-gray-200 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Reason for license failure
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              {props.licence.refunded
                ? 'You requested it to be refunded. '
                : ''}{' '}
              {props.licence.disputed ? 'You have disputed the payment. ' : ''}
            </dd>
          </div>
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
