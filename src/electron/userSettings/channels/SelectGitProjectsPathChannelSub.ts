import { IpcMainEvent, dialog } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { UserSettingsService } from '../services/UserSettingsService'
import { UserSettingsResponse } from './MessageTypes'
import { SelectGitProjectsPathChannelPub } from './SelectGitProjectsPathChannelPub'

export class SelectGitProjectsPathChannelSub
  extends SelectGitProjectsPathChannelPub
  implements IIpcMainInvokeEventSub<void, UserSettingsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: void,
  ): Promise<UserSettingsResponse> {
    console.log(request)
    try {
      const settings = await UserSettingsService.getSettings()
      const dialogResult = await dialog.showOpenDialog({
        properties: ['openDirectory', 'dontAddToRecent'],
        title: 'Select Your Git Projects Path',
        message: 'Select Your Git Projects Path',
        defaultPath: settings.projectsPath,
      })
      if (dialogResult.canceled) {
        return settings
      }
      const newPath = dialogResult.filePaths[0]
      settings.projectsPath = newPath
      await UserSettingsService.saveFile(settings)

      return settings
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)

      throw error
    }
  }
}
