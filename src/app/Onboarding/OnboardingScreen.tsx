/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetFirstUsageDate } from '../AppSettings/ReactQueryWrappers'
import PageHeader from '../components/PageHeader'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import OnboardingDialog from './OnboardingDialog'

export function OnboardingScreen() {
  const navigation = useNavigate()
  const setFirstUsage = useSetFirstUsageDate()
  const [closed, setClosed] = useState(false)
  const [logMessages, logAMessage] = useContext(ConsoleContext)

  useEffect(() => {
    if (
      closed &&
      !setFirstUsage.isSuccess &&
      !setFirstUsage.isLoading &&
      !setFirstUsage.isError
    ) {
      setFirstUsage.mutateAsync(undefined, {
        onSuccess: () => {
          logAMessage({
            message: 'redirecting to settings page',
            level: 'info',
          })

          navigation('/settings')
        },
      })
    }
    return
  }, [
    closed,
    setFirstUsage.isSuccess,
    setFirstUsage.isLoading,
    setFirstUsage.isError,
  ])

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={''}></PageHeader>
      <OnboardingDialog closed={closed} setClosed={setClosed} />
    </div>
  )
}
