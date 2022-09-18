import { IpcMainEvent } from 'electron'
import { SaveSettingsMessage, SettingsResponse } from './MessageTypes'
import { ApplicationSettingService } from '../services/ApplicationSettingService'
import { SaveSettingsChannelPub } from './SaveSettingsChannelPub'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'

export class SaveSettingsChannelSub
  extends SaveSettingsChannelPub
  implements IIpcMainInvokeEventSub<SaveSettingsMessage, SettingsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: SaveSettingsMessage
  ): Promise<SettingsResponse> {
    console.log(request)
    try {
      await ApplicationSettingService.saveFile(request.settings)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)
      throw error
    }

    return {
      settings: request.settings,
      meta: { appSettingsFileLocation: ApplicationSettingService.filePath },
    }
  }
}
