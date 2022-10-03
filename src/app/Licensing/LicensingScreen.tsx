/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext } from 'react'
import PageHeader from '../components/PageHeader'
import { useGetLicensing } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { LicenseKeyForm } from './LicenseKeyForm'
import { UnLicenseDisplay } from './UnLicenseDisplay'
import { LicenseDisplay } from './LicenseDisplay'
import { TrialDisplay } from './TrialDisplay'
import { CTADisplayOld } from './CTADisplayOld'
import { CTADisplayManualElements } from './CTADisplayManualElements'
export const LicensingScreen = () => {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  const { isLoading, data, error } = useGetLicensing()

  if (!data || isLoading) {
    return <>Loading...</>
  }

  return (
    <div className="">
      <PageHeader pageTitle={'Your License Details'}></PageHeader>
      {data.licenseKey && !data.mustEnterLicenseKey && (
        <div className="mt-8">
          <LicenseDisplay licence={data!} />
        </div>
      )}
      {data.isTrialling && (
        <>
          <div className="mt-8">
            <TrialDisplay licence={data!} />{' '}
          </div>
          <div className="mt-8">
            <div className="flex space-x-8">
              <CTADisplayManualElements />
              <LicenseKeyForm />
            </div>
          </div>
        </>
      )}
      {data.licenseKey && data.mustEnterLicenseKey && (
        <>
          <div className="mt-8">
            <UnLicenseDisplay licence={data} />
          </div>
          <div className="mt-8">
            <div className="flex space-x-8">
              <CTADisplayManualElements />
              <LicenseKeyForm />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
