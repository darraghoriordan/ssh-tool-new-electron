import { PropsWithChildren } from 'react'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import SettingTextField from './SettingTextField'
import { UseFormRegister } from 'react-hook-form'
/* eslint-disable @typescript-eslint/no-explicit-any */
const SettingsFormSection = ({
  header,
  subHeader,
  sections,
  register,
  errors,
  children,
}: {
  header: string
  subHeader: string
  sections?: {
    propertyKey: keyof UserSettings
    labelText: string
    isRequired?: boolean
  }[]
  register: UseFormRegister<UserSettings>
  errors: Record<string, any>
} & PropsWithChildren) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <h3 className="text-lg font-medium text-gray-900 leading-6">
          {header}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{subHeader}</p>
      </div>
      <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
        <div className="grid grid-cols-3 gap-6">
          {sections &&
            sections.map(section => (
              <SettingTextField
                key={section.propertyKey}
                settingKey={section.propertyKey}
                register={register}
                errors={errors}
                isRequired={section.isRequired}
                labelText={section.labelText}
              />
            ))}
          {children}
        </div>
      </div>
    </div>
  )
}

export default SettingsFormSection
