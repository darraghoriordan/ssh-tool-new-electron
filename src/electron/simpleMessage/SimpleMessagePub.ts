import { IIpcMainSendEventPub } from '../IpcChannelTypes/IIpcMainSendEventPub'
import { SendChannelBasePub } from '../IpcChannelTypes/SendChannelBasePub'

export class SimpleMessagePub extends SendChannelBasePub<string> {
  constructor() {
    super('message', 'SimpleMessage')
  }
}
