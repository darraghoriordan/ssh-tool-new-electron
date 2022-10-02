/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader, { PageHeaderProps } from '../components/PageHeader'
import { useGetLicensing } from './ReactQueryWrappers'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { LicenseKeyForm } from './LicenseKeyForm'
import { UnLicenseDisplay } from './UnLicenseDisplay'
import { LicenseDisplay } from './LicenseDisplay'
import { TrialDisplay } from './TrialDisplay'
import { CTADisplay } from './CTADisplay'
export const LicensingScreen = () => {
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  const { isLoading, data, error } = useGetLicensing()

  if (!data || isLoading) {
    return <>Loading...</>
  }

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Your License Details'}></PageHeader>
      <div className="">
        {data.licenseKey && !data.mustEnterLicenseKey && (
          <LicenseDisplay licence={data!} />
        )}
        {data.isTrialling && <TrialDisplay licence={data!} />}
        {data.licenseKey && data.mustEnterLicenseKey && (
          <UnLicenseDisplay licence={data} />
        )}
        <CTADisplay />
        {(data.isTrialling || data.mustEnterLicenseKey) && <LicenseKeyForm />}
      </div>
    </div>
  )
}
