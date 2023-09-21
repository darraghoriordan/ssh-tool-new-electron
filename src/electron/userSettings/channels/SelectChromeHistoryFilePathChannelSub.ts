import { IpcMainEvent, dialog } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { UserSettingsService } from '../services/UserSettingsService'
import { UserSettingsResponse } from './MessageTypes'
import { SelectChromeHistoryFilePathChannelPub } from './SelectChromeHistoryFilePathChannelPub'

export class SelectChromeHistoryFilePathChannelSub
  extends SelectChromeHistoryFilePathChannelPub
  implements IIpcMainInvokeEventSub<void, UserSettingsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: void,
  ): Promise<UserSettingsResponse> {
    console.log(request)
    const message = 'Select the history file for Google Chrome'
    try {
      const settings = await UserSettingsService.getSettings()
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openFile', 'showHiddenFiles', 'dontAddToRecent'],
        title: message,
        message: message,
        defaultPath: settings.chromeHistoryPath,
      })
      if (dialogResult.canceled) {
        return settings
      }
      const newPath = dialogResult.filePaths[0]
      settings.chromeHistoryPath = newPath
      await UserSettingsService.saveFile(settings)

      return settings
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)

      throw error
    }
  }
}
