/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import PageHeader from '../components/PageHeader'
import OnboardingDialog from './OnboardingDialog'

export function OnboardingScreen() {
  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={''}></PageHeader>
      <OnboardingDialog />
    </div>
  )
}
