import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'

import { DevHistoryGetDayChannelPub } from './DevHistoryGetDayChannelPub'
import { DevHistoryDayResponse, DevHistoryGetDayRequest } from './MessageTypes'
import { getStartAndEndOfDay } from '../services/time-wrangler'
import { readChromeHistory } from '../services/chrome-browser-history'

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
    // read the list of entries from the chrome history sqlite database
    // return the list of entries
    const history = await readChromeHistory(getStartAndEndOfDay(request.date))
    return {
      chromeHistory: history,
    }
  }
}
