import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { StringSorter } from '../StringSorterService'
import { StringSorterChannelPub } from './StringSorterChannelPub'
import { StringSorterMessage, StringSorterResponse } from './MessageTypes'

export class StringSorterChannelSub
  extends StringSorterChannelPub
  implements IIpcMainInvokeEventSub<StringSorterMessage, StringSorterResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: StringSorterMessage
  ): Promise<StringSorterResponse> {
    return StringSorter.sortByNewLine(request.data, request.asc)
  }
}
