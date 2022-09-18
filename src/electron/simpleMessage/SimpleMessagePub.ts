import { SendChannelBasePub } from '../IpcChannelTypes/SendChannelBasePub'

export class SimpleMessagePub extends SendChannelBasePub {
  constructor() {
    super('message', 'SimpleMessage')
  }
}
