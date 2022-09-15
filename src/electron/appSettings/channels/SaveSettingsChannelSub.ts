import { IpcMainEvent } from 'electron'
import { SaveSettingsMessage, SettingsResponse } from '../MessageTypes'
import { ApplicationSettingsFileService } from '../services/ApplicationSettingsFileService'
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
    const settingsService = new ApplicationSettingsFileService()
    settingsService.saveFile(request.settings)
    return {
      settings: request.settings,
      isInError: false,
      errorMessage: undefined,
    }
  }
}
