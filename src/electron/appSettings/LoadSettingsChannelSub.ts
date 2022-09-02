/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron'
import { SettingsResponse } from './MessageTypes'
import { ApplicationSettingsFileService } from '../services/applicationSettings/ApplicationSettingsFileService'
import { LoadSettingsChannelPub } from './LoadSettingsChannelPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'

export class LoadSettingsChannelSub
  extends LoadSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, SettingsResponse>
{
  async handle(event: IpcMainEvent): Promise<SettingsResponse> {
    console.log('Loading settings file...')
    const settingsService = new ApplicationSettingsFileService()
    const settingsFile = await settingsService.loadFile()
    return { settings: settingsFile, isInError: false, errorMessage: undefined }
  }
}
