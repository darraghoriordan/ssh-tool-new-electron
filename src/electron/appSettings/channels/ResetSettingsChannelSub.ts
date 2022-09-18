import { IpcMainEvent } from 'electron'
import { ApplicationSettingService } from '../services/ApplicationSettingService'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { ResetSettingsChannelPub } from './ResetSettingsChannelPub'

export class ResetSettingsChannelSub
  extends ResetSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, void>
{
  async handle(event: IpcMainEvent, request: void): Promise<void> {
    console.log(request)
    try {
      await ApplicationSettingService.deleteFile()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)
      throw error
    }
  }
}
