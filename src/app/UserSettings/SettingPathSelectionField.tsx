/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { UseFormRegister } from 'react-hook-form'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'

export function SettingPathSelectionField({
  settingKey, // projectsPath
  register,
  errors,
  labelText, //       Git project path to scan for repositories
  isRequired,
  onSelect,
  pathIcon,
}: {
  settingKey: keyof UserSettings
  register: UseFormRegister<UserSettings>
  errors: Record<string, any>
  labelText: string
  isRequired?: boolean
  onSelect: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>
  pathIcon: 'folder' | 'file'
}) {
  return (
    <div className="col-span-3 ">
      <label
        htmlFor={settingKey}
        className="block text-sm font-medium text-gray-900 leading-6"
      >
        {labelText}
      </label>
      <div className="flex mt-2 rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {pathIcon === 'folder' ? (
              <FolderIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            ) : (
              <DocumentIcon
                className="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </div>
          <input
            {...register(settingKey, {
              required: isRequired === undefined ? true : isRequired,
              min: 1,
            })}
            className="block w-full pl-10 text-gray-900 border-0 rounded-none rounded-l-md py-1.5 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="relative inline-flex items-center px-3 py-2 -ml-px text-sm font-semibold text-gray-900 gap-x-1.5 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <MagnifyingGlassIcon
            className="w-5 h-5 text-gray-400 -ml-0.5"
            aria-hidden="true"
          />
          Choose
        </button>
      </div>
      {errors[settingKey] && (
        <span className="text-red-600">This field is required</span>
      )}
    </div>
  )
}
