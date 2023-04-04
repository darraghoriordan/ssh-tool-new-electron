import { UserSettings } from '../../electron/userSettings/models/UserSettings'

/* eslint-disable @typescript-eslint/no-explicit-any */
const SettingTextField = ({
  settingKey, // projectsPath
  register,
  errors,
  data,
  labelText, //       Git project path to scan for repositories
  isRequired,
}: {
  settingKey: keyof UserSettings
  register: (key: string, options: any) => any
  errors: Record<string, any>
  data: Record<string, any>
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
      <div className="flex mt-1 rounded-md shadow-sm">
        <input
          {...register(settingKey, {
            required: isRequired === undefined ? true : isRequired,
            min: 1,
          })}
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={data[settingKey]}
        />
      </div>
      {errors[settingKey] && (
        <span className="text-red-600">This field is required</span>
      )}
    </div>
  )
}
export default SettingTextField
