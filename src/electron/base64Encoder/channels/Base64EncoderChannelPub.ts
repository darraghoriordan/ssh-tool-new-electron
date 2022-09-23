import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { Base64EncoderChannels } from './Base64EncoderChannelEnum'

export class Base64EncoderChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('Base64Encoder', Base64EncoderChannels.ENCODE_BASE64)
  }
}
