import { IpcMainEvent } from 'electron'
import { IIpcMainSendEventSub } from '../IpcChannelTypes/IIpcMainSendEventSub'
import { SimpleMessagePub } from './SimpleMessagePub'

export class SimpleMessageSub
  extends SimpleMessagePub
  implements IIpcMainSendEventSub<string>
{
  handle(event: IpcMainEvent, message: string): void {
    console.log(message)
  }
}
