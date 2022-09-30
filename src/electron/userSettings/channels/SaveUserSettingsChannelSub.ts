import { IpcMainEvent } from 'electron'
import { SaveUserSettingsMessage, UserSettingsResponse } from './MessageTypes'
import { UserSettingsService } from '../services/UserSettingsService'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { SaveUserSettingsChannelPub } from './SaveUserSettingsChannelPub'

export class SaveUserSettingsChannelSub
  extends SaveUserSettingsChannelPub
  implements
    IIpcMainInvokeEventSub<SaveUserSettingsMessage, UserSettingsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: SaveUserSettingsMessage
  ): Promise<UserSettingsResponse> {
    console.log(request)
    try {
      await UserSettingsService.saveFile(request.settings)
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)
      throw error
    }

    return request.settings
  }
}
