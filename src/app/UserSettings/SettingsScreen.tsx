/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement } from 'react'
import PageHeader from '../components/PageHeader'
import {
  useGetSettings,
  useResetSettings,
  useSaveSettings,
  useSelectChromeHistoryFilePath,
  useSelectGitConfigFilePath,
  useSelectGitProjectsPath,
  useSelectSshConfigFilePath,
} from './ReactQueryWrappers'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { useGetAppSettings } from '../AppSettings/ReactQueryWrappers'
import { SettingsForm } from './SettingsForm'
import { UserSettings } from '../../electron/userSettings/models/UserSettings'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'
const faqs = [
  {
    id: 1,
    question: 'Git Projects Path',
    answer:
      'This setting controls where the app will look for git projects. It will look in this folder and all subfolders. You should make sure this setting is correct before using the Git Project Tool.',
  },
  {
    id: 2,
    question: 'Global Git Config File',
    answer:
      "This setting controls where the app will look for your global git config file. It's used to determine your global git username and email address.",
  },
  {
    id: 3,
    question: 'Ssh Config File',
    answer:
      "This setting controls where the app will look for your ssh config file. It's used to determine your local ssh aliases. You should make sure this setting is correct before using the Git Url Tool.",
  },
  {
    id: 4,
    question: 'Marketing week Enabled',
    answer:
      "You have to explicitly enable marketing week because it does send data out to OpenAI's servers. By enabling this feature, you agree to share your data.",
  },
  {
    id: 5,
    question: 'Chrome History Path',
    answer:
      'Marketing week uses your Chrome history to provide suggestions for marketing. You have to set this manually, here are the default locations. Mac: <home>/Library/Application Support/Google/Chrome/Default/History Linux: <home>/.config/google-chrome/Default/History Windows: <home>/AppData/Local/Google/Chrome/User Data/Default/History ',
  },
  {
    id: 6,
    question: 'ChatGPT Api Key and Org Id',
    answer:
      'The ChatGPT Api Key is used to access the ChatGPT API. You can get an api key at https://openai.com',
  },
]

export const SettingsScreen = () => {
  const { data: appSettings } = useGetAppSettings()
  const setProjectsPathMutation = useSelectGitProjectsPath()
  const setGitConfigFilePathMutation = useSelectGitConfigFilePath()
  const setSshConfigFilePathMutation = useSelectSshConfigFilePath()
  const setChromeHistoryFilePathMutation = useSelectChromeHistoryFilePath()
  const { isLoading, data } = useGetSettings()
  const saveMutation = useSaveSettings()
  const resetMutation = useResetSettings()

  //   const onResetClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //     event.preventDefault()
  //     const settingsResponse = await resetMutation.mutateAsync()
  //   }
  const onSelectGitProjectPath = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setProjectsPathMutation.mutateAsync()
  }
  const onSelectGitConfigFilePath = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setGitConfigFilePathMutation.mutateAsync()
  }
  const onSelectSshConfigFilePath = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setSshConfigFilePathMutation.mutateAsync()
  }
  const onOpenSelectChromeHistoryFileClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    await setChromeHistoryFilePathMutation.mutateAsync()
  }
  const onOpenSettingsFolderClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    // shell.showItemInFolder(data!.meta.appSettingsFileLocation)
    window.OpenFileLocation.invoke(
      appSettings!.runtimeApplicationSettings.userSettingsFileLocation,
    )
  }
  let control: ReactElement | undefined = undefined
  if (isLoading || data === undefined) {
    control = <>Loading...</>
  }
  const handleSubmit = async (data: UserSettings) => {
    saveMutation.mutate({
      projectsPath: data['projectsPath']!,
      globalGitConfigFile: data['globalGitConfigFile'],
      chromeHistoryPath: data['chromeHistoryPath'],
      sshConfigFilePath: data['sshConfigFilePath'],
      openAiOrgId:
        data['openAiOrgId'] === '' || !data['openAiOrgId']
          ? undefined
          : data['openAiOrgId'],
      hasEnabledMarketingWeek:
        // there's some issue with react form here. it returned "false" as a string one time
        // so i do this to make sure it's a boolean
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data['hasEnabledMarketingWeek'] as any) === 'true' ||
        data['hasEnabledMarketingWeek'] === true
          ? true
          : false,
      openAiChatGptKey:
        data['openAiChatGptKey'] === '' || !data['openAiChatGptKey']
          ? undefined
          : data['openAiChatGptKey'],
    })
  }
  if (!isLoading && data && control === undefined) {
    control = (
      <SettingsForm
        data={data}
        onSubmit={handleSubmit}
        onOpenSelectChromeHistoryFileClick={onOpenSelectChromeHistoryFileClick}
        onOpenSelectGitProjectDirectoryClick={onSelectGitProjectPath}
        onOpenSelectGitConfigFileClick={onSelectGitConfigFilePath}
        onOpenSelectSshConfigFileClick={onSelectSshConfigFilePath}
      />
    )
  }
  return (
    <ScreenWrapper>
      <PageHeader pageTitle={'App Settings'}>
        {data && (
          <button
            type="button"
            disabled={resetMutation.isLoading}
            onClick={e => onOpenSettingsFolderClick(e)}
            className="inline-flex items-center invisible px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <FolderOpenIcon className="w-5 h-5 mr-2" />
            Edit settings as JSON...
          </button>
        )}
      </PageHeader>
      <DescriptionAndHelp faqs={faqs} title={'Settings Help and FAQ'} />
      {control}
    </ScreenWrapper>
  )
}
