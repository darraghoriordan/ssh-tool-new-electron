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
  /**
   * if on a trial
   * how long left
   * how to convert to paid
   *
   * if on a paid license
   * - the license key
   * - to who
   * - purchase date
   * - IF VALID (!mustenterlicensekey)
   * - when free updates expire
   *
   * IF NOT VALID
   * - message if current build is too new
   *  - a message if disputed or refunded
   * - how to renew if needed
   *
   * - how to get support
   *
   */

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={'Your License Details'}></PageHeader>

      {data.licenseKey && !data.mustEnterLicenseKey && (
        <LicenseDisplay licence={data!} />
      )}
      {data.isTrialling && <TrialDisplay licence={data!} />}
      {data.licenseKey && data.mustEnterLicenseKey && (
        <UnLicenseDisplay licence={data} />
      )}
      {(data.isTrialling || data.mustEnterLicenseKey) && <CTADisplay />}
      {(data.isTrialling || data.mustEnterLicenseKey) && <LicenseKeyForm />}
    </div>
  )
}
