/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetFirstUsageDate } from '../AppSettings/ReactQueryWrappers'
import PageHeader from '../components/PageHeader'
import OnboardingDialog from './OnboardingDialog'

export function OnboardingScreen() {
  const navigation = useNavigate()
  const setFirstUsage = useSetFirstUsageDate()
  const [closed, setClosed] = useState(false)

  useEffect(() => {
    if (
      closed &&
      !setFirstUsage.isLoading &&
      setFirstUsage.failureCount <= 0 &&
      !setFirstUsage.isSuccess &&
      !setFirstUsage.isError
    ) {
      setFirstUsage.mutateAsync(undefined, {
        onSuccess: () => {
          console.log('navigation in on success')
          navigation('/settings')
        },
      })
      console.log('running in useEffect')
      return () => {
        console.log('running in useEffect return')
        navigation('/settings')
      }
    }
    return
  }, [
    closed,
    setFirstUsage.isLoading,
    setFirstUsage.failureCount,
    setFirstUsage.isSuccess,
    setFirstUsage.isError,
    navigation,
  ])

  return (
    <div className="max-w-10xl mx-auto">
      <PageHeader pageTitle={''}></PageHeader>
      <OnboardingDialog closed={closed} setClosed={setClosed} />
    </div>
  )
}
