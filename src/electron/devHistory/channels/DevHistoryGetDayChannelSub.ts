import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'

import { DevHistoryGetDayChannelPub } from './DevHistoryGetDayChannelPub'
import { DevHistoryDayResponse, DevHistoryGetDayRequest } from './MessageTypes'

export class DevHistoryGetDayChannelSub
  extends DevHistoryGetDayChannelPub
  implements
    IIpcMainInvokeEventSub<DevHistoryGetDayRequest, DevHistoryDayResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: DevHistoryGetDayRequest,
  ): Promise<DevHistoryDayResponse> {
    return {
      result: 'test',
    }
  }
}
