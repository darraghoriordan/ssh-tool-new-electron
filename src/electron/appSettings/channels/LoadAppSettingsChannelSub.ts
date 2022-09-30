/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, IpcMainEvent } from 'electron'
import { ApplicationSettingService } from '../services/ApplicationSettingService'
import { LoadAppSettingsChannelPub } from './LoadAppSettingsChannelPub'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { AppSettingsResponse } from './MessageTypes'

export class LoadAppSettingsChannelSub
  extends LoadAppSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, AppSettingsResponse>
{
  async handle(event: IpcMainEvent): Promise<AppSettingsResponse> {
    console.log('Loading app settings file...')

    const settingsFile = await ApplicationSettingService.getSettings()
    return settingsFile
  }
}
