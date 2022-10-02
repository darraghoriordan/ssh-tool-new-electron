import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useSetLicensing } from './ReactQueryWrappers'

export const LicenseKeyForm = () => {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const setLicense = useSetLicensing()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm()

  return (
    <div className="mt-8 overflow-hidden bg-white shadow rounded-lg">
      <div className="px-4 pt-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Already have a license?
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Thanks for your purchase! Please enter your license key below.
        </p>
      </div>
      <div className="px-4 py-5">
        <form
          className="mb-8 "
          action="#"
          method="POST"
          onError={e => {
            logAMessage({
              message: `Form error at ${e.target}`,
              level: 'error',
            })
          }}
          onSubmit={handleSubmit(data => {
            setLicense.mutate({
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
            className="w-full rounded-md border border-gray-800 px-5 py-3 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your license key"
          />
          <div className="mt-3 rounded-md shadow">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Set License Key
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
