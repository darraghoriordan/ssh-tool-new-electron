/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useForm } from 'react-hook-form'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import SettingsFormSection from './SettingsFormSection'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { SettingPathSelectionField } from './SettingPathSelectionField'
import { DocumentCheckIcon } from '@heroicons/react/24/outline'

const gitSections = [
  {
    propertyKey: 'projectsPath' as keyof UserSettings,
    isRequired: true,
    labelText: 'Git project path to scan for repositories',
  },
  {
    propertyKey: 'globalGitConfigFile' as keyof UserSettings,
    isRequired: true,
    labelText: 'Global Git Config File',
  },
]

export function SettingsForm({
  data,
  onOpenSelectGitProjectDirectoryClick,
  onOpenSelectGitConfigFileClick,
  onOpenSelectSshConfigFileClick,
  onSubmit,
  onOpenSelectChromeHistoryFileClick,
}: {
  data: UserSettings
  onOpenSelectGitProjectDirectoryClick: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>
  onOpenSelectGitConfigFileClick: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>
  onOpenSelectSshConfigFileClick: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>
  onOpenSelectChromeHistoryFileClick: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>
  onSubmit: (data: UserSettings) => Promise<void>
}) {
  const [_logMessage, logAMessage] = useContext(ConsoleContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSettings>()

  return (
    <form
      className="space-y-6"
      action="#"
      method="POST"
      // eslint-disable-next-line react/no-unknown-property
      onError={e => {
        logAMessage({ message: `Form error at ${e.target}`, level: 'error' })
      }}
      onSubmit={handleSubmit(data => onSubmit(data))}
    >
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6 space-y-16">
        <SettingsFormSection
          header="Git Settings"
          subHeader="Used for working with your git repositories."
          register={register}
          errors={errors}
          data={data}
        >
          <SettingPathSelectionField
            key={gitSections[0].propertyKey}
            settingKey={gitSections[0].propertyKey}
            register={register}
            errors={errors}
            isRequired={gitSections[0].isRequired}
            data={data}
            labelText={gitSections[0].labelText}
            pathIcon="folder"
            onSelect={onOpenSelectGitProjectDirectoryClick}
          />
          <SettingPathSelectionField
            key={gitSections[1].propertyKey}
            settingKey={gitSections[1].propertyKey}
            register={register}
            errors={errors}
            isRequired={gitSections[1].isRequired}
            data={data}
            labelText={gitSections[1].labelText}
            pathIcon="file"
            onSelect={onOpenSelectGitConfigFileClick}
          />
        </SettingsFormSection>
        <SettingsFormSection
          header="Ssh Settings"
          subHeader="Used for working with ssh certificates"
          register={register}
          errors={errors}
          data={data}
        >
          <SettingPathSelectionField
            key={'sshConfigFilePath'}
            settingKey={'sshConfigFilePath'}
            register={register}
            errors={errors}
            isRequired={true}
            data={data}
            labelText={'SSH Config File'}
            pathIcon="file"
            onSelect={onOpenSelectSshConfigFileClick}
          />
        </SettingsFormSection>
        <SettingsFormSection
          header="Marketing Week Settings"
          subHeader="Used for creating your Marketing Week reports"
          register={register}
          errors={errors}
          data={data}
        >
          <SettingPathSelectionField
            key={'chromeHistoryPath'}
            settingKey={'chromeHistoryPath'}
            register={register}
            errors={errors}
            isRequired={true}
            data={data}
            labelText={'Chrome History File'}
            pathIcon="file"
            onSelect={onOpenSelectChromeHistoryFileClick}
          />
        </SettingsFormSection>
        <SettingsFormSection
          header="Open Ai Settings"
          subHeader="Used for working with Open Ai"
          sections={[
            {
              propertyKey: 'openAiChatGptKey',
              labelText:
                'ChatGPT Ai Key ( https://platform.openai.com/account/api-keys )',
              isRequired: false,
            },
            {
              propertyKey: 'openAiOrgId',
              labelText:
                'Open Ai Org Id ( https://platform.openai.com/account/org-settings )',
              isRequired: false,
            },
          ]}
          register={register}
          errors={errors}
          data={data}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <DocumentCheckIcon className="w-5 h-5 mr-2" />
        Save
      </button>
    </form>
  )
}
