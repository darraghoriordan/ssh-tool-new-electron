import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { UserSettingsService } from '../services/UserSettingsService'
import { UserSettingsResponse } from './MessageTypes'
import { ResetUserSettingsChannelPub } from './ResetUserSettingsChannelPub'

export class ResetUserSettingsChannelSub
  extends ResetUserSettingsChannelPub
  implements IIpcMainInvokeEventSub<void, UserSettingsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: void
  ): Promise<UserSettingsResponse> {
    console.log(request)
    try {
      await UserSettingsService.deleteFile()
      const settings = await UserSettingsService.getDefaultSettings()
      return settings
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)

      throw error
    }
  }
}
