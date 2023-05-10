import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { UnixTimeConverter } from '../UnixTimeConverterService'
import { UnixTimeConverterChannelPub } from './UnixTimeConverterChannelPub'
import {
  UnixTimeConverterMessage,
  UnixTimeConverterResponse,
} from './MessageTypes'

export class UnixTimeConverterChannelSub
  extends UnixTimeConverterChannelPub
  implements
    IIpcMainInvokeEventSub<UnixTimeConverterMessage, UnixTimeConverterResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: UnixTimeConverterMessage
  ): Promise<UnixTimeConverterResponse> {
    return UnixTimeConverter.convert(
      request.unixTimestamp,
      new Date(),
      request.locale
    )
  }
}
