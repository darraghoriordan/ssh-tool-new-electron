import { IpcMainEvent } from 'electron'
import { ApplicationSettingService } from '../services/ApplicationSettingService'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { ResetSettingsChannelPub } from './ResetSettingsChannelPub'
import { SettingsResponse } from './MessageTypes'

export class ResetSettingsChannelSub
  extends ResetSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, SettingsResponse>
{
  async handle(event: IpcMainEvent, request: void): Promise<SettingsResponse> {
    console.log(request)
    try {
      await ApplicationSettingService.deleteFile()
      const settings = await ApplicationSettingService.getDefaultSettings()
      return {
        settings,
        meta: { appSettingsFileLocation: ApplicationSettingService.filePath },
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)

      throw error
    }
  }
}
