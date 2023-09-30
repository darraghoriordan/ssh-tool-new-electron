import { IpcMainEvent, dialog } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { UserSettingsService } from '../services/UserSettingsService'
import { UserSettingsResponse } from './MessageTypes'
import { SelectSshConfigFilePathChannelPub } from './SelectSshConfigFilePathChannelPub'

export class SelectSshConfigFilePathChannelSub
  extends SelectSshConfigFilePathChannelPub
  implements IIpcMainInvokeEventSub<void, UserSettingsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: void,
  ): Promise<UserSettingsResponse> {
    console.log(request)
    const message = 'Select SSH Config File (usually ~/.ssh/config)'
    try {
      const settings = await UserSettingsService.getSettings()
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openFile', 'showHiddenFiles', 'dontAddToRecent'],
        defaultPath: settings.sshConfigFilePath,
        title: message,
        message: message,
      })
      if (dialogResult.canceled) {
        return settings
      }
      const newPath = dialogResult.filePaths[0]
      settings.sshConfigFilePath = newPath
      await UserSettingsService.saveFile(settings)

      return settings
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)

      throw error
    }
  }
}
