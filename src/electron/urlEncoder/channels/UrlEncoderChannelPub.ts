import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { UrlEncoderChannels } from './UrlEncoderChannelEnum'

export class UrlEncoderChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('UrlEncoder', UrlEncoderChannels.ENCODE_URL)
  }
}
