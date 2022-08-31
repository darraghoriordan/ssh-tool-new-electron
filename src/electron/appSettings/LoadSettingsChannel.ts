import { IpcMainEvent, ipcRenderer } from 'electron'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { SettingsResponse } from './MessageTypes'
import { AppSettingsChannels } from './AppSettingsChannelEnum'
import { ApplicationSettingsFileService } from '../services/applicationSettings/ApplicationSettingsFileService'

export class LoadSettingsChannel
  implements IpcMainInvokeEventChannelInterface<void, SettingsResponse>
{
  public static ExposedApiName = 'LoadSettings'

  getExposedApiName(): string {
    return LoadSettingsChannel.ExposedApiName
  }

  getChannelName(): string {
    return AppSettingsChannels.LOAD_SETTINGS
  }

  async invoke(): Promise<SettingsResponse> {
    return ipcRenderer.invoke(AppSettingsChannels.LOAD_SETTINGS)
  }

  async handle(event: IpcMainEvent): Promise<SettingsResponse> {
    console.log('Loading settings file...')
    const settingsService = new ApplicationSettingsFileService()
    const settingsFile = await settingsService.loadFile()
    return { settings: settingsFile, isInError: false, errorMessage: undefined }
  }
}
