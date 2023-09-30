import { UseFormRegister } from 'react-hook-form'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'

/* eslint-disable @typescript-eslint/no-explicit-any */
const BooleanField = ({
  settingKey,
  register,
  errors,

  labelText,
}: {
  settingKey: keyof UserSettings
  register: UseFormRegister<UserSettings>
  errors: Record<string, any>
  labelText: string
  isRequired?: boolean
}) => {
  return (
    <div className="col-span-3 ">
      <label
        htmlFor={settingKey}
        className="block text-sm font-medium text-gray-700"
      >
        {labelText}
      </label>
      <div className="flex mt-1 rounded-sm">
        <input
          {...register(settingKey, {})}
          type="checkbox"
          className="block p-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      {errors[settingKey] && (
        <span className="text-red-600">This field is required</span>
      )}
    </div>
  )
}
export default BooleanField
