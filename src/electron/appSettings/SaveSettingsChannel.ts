import { IpcMainEvent, ipcRenderer } from 'electron'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { SaveSettingsMessage, SettingsResponse } from './MessageTypes'
import { AppSettingsChannels } from './AppSettingsChannelEnum'
import { ApplicationSettingsFileService } from '../services/applicationSettings/ApplicationSettingsFileService'

export class SaveSettingsChannel
  implements
    IpcMainInvokeEventChannelInterface<SaveSettingsMessage, SettingsResponse>
{
  public static ExposedApiName = 'SaveSettings'

  getExposedApiName(): string {
    return SaveSettingsChannel.ExposedApiName
  }

  getChannelName(): string {
    return AppSettingsChannels.SAVE_SETTINGS
  }

  async invoke(request: SaveSettingsMessage): Promise<SettingsResponse> {
    return ipcRenderer.invoke(AppSettingsChannels.SAVE_SETTINGS, request)
  }

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
