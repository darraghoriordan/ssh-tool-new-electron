/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron'
import { SettingsResponse } from './MessageTypes'
import { ApplicationSettingService } from '../services/ApplicationSettingService'
import { LoadSettingsChannelPub } from './LoadSettingsChannelPub'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'

export class LoadSettingsChannelSub
  extends LoadSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, SettingsResponse>
{
  async handle(event: IpcMainEvent): Promise<SettingsResponse> {
    console.log('Loading settings file...')

    const settingsFile = await ApplicationSettingService.getSettings()
    return {
      settings: settingsFile,
      meta: { appSettingsFileLocation: ApplicationSettingService.filePath },
    }
  }
}
