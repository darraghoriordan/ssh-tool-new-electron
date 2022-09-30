/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, IpcMainEvent } from 'electron'
import { UserSettingsResponse } from './MessageTypes'
import { UserSettingsService } from '../services/UserSettingsService'
import { LoadUserSettingsChannelPub } from './LoadUserSettingsChannelPub'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'

export class LoadUserSettingsChannelSub
  extends LoadUserSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, UserSettingsResponse>
{
  async handle(event: IpcMainEvent): Promise<UserSettingsResponse> {
    console.log('Loading user settings file...')

    const settingsFile = await UserSettingsService.getSettings()
    return settingsFile
  }
}
