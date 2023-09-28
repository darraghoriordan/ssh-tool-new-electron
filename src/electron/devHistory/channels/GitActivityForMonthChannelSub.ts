import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GitActivityForMonthChannelPub } from './GitActivityForMonthChannelPub'
import {
  GitActivityForMonthRequest,
  GitActivityForMonthResponse,
} from './MessageTypes'
import { gitActivityForMonth } from '../services/month-analyser'

export class GitActivityForMonthChannelSub
  extends GitActivityForMonthChannelPub
  implements
    IIpcMainInvokeEventSub<
      GitActivityForMonthRequest,
      GitActivityForMonthResponse
    >
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GitActivityForMonthRequest,
  ): Promise<GitActivityForMonthResponse> {
    // read the list of entries from the chrome history sqlite database
    // return the list of entries
    const analysis = await gitActivityForMonth(
      request.startDate,
      request.endDate,
    )

    return {
      activity: analysis,
    }
  }
}
