import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useSetLicensing } from './ReactQueryWrappers'

export const LicenseKeyForm = () => {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const setLicense = useSetLicensing()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()

  return (
    <div className="mx-auto bg-white rounded-lg shadow h-fit">
      <div className="max-w-3xl pt-12 pb-0 mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
          Already have a license?
        </h2>
        <p className="pt-4 pb-0 text-lg">
          Thanks for your purchase! Please enter your license key below.
        </p>
      </div>

      <div className="px-4 py-5">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <form
          className="mb-8 "
          action="#"
          method="POST"
          onSubmit={handleSubmit(async data => {
            const result = await setLicense.mutateAsync({
              licenseKey: data['license-key'],
            })
          })}
        >
          <label htmlFor="license-key" className="sr-only">
            License Key
          </label>
          <input
            {...register('license-key', { required: true, min: 4 })}
            required
            className="w-full px-5 py-3 placeholder-gray-500 border border-gray-800 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your license key"
          />
          <div className="mt-3 shadow rounded-md">
            <button
              type="submit"
              className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Set License Key
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
