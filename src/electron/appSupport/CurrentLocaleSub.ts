import { IpcMainEvent, app } from 'electron'
import { CurrentLocalePub } from './CurrentLocalePub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'

export class CurrentLocaleSub
  extends CurrentLocalePub
  implements IIpcMainInvokeEventSub<void, string>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: void
  ): Promise<string> {
    return app.getSystemLocale()
  }
}
