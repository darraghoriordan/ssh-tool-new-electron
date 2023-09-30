import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GitActivityForMonthChannelPub } from './GitActivityForMonthChannelPub'
import {
  GitActivityForMonthRequest,
  GitActivityForMonthResponse,
} from './MessageTypes'
import { gitActivityForMonth } from '../services/month-analyser'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'

export class GitActivityForMonthChannelSub
  extends GitActivityForMonthChannelPub
  implements
    IIpcMainInvokeEventSub<
      GitActivityForMonthRequest,
      GitActivityForMonthResponse
    >
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GitActivityForMonthRequest,
  ): Promise<GitActivityForMonthResponse> {
    // read the list of entries from the chrome history sqlite database
    // return the list of entries

    await validateSettingsForTool()
    const analysis = await gitActivityForMonth(
      request.startDate,
      request.endDate,
    )

    return {
      activity: analysis,
    }
  }
}
export async function validateSettingsForTool() {
  const userSettings = await UserSettingsService.getSettings()
  if (!userSettings.hasEnabledMarketingWeek) {
    throw new Error(
      'Marketing week is not enabled. You have to explicitly enable this feature in the App Settings because it shares your data with Open AI when this tool is opened.',
    )
  }
  if (!userSettings.openAiChatGptKey) {
    throw new Error(
      'Marketing week is not enabled. You must configure an Open AI key in the App Settings.',
    )
  }
  if (!userSettings.chromeHistoryPath) {
    throw new Error(
      'Marketing week is not enabled. You must configure the Chrome History file path in the App Settings.',
    )
  }
}
