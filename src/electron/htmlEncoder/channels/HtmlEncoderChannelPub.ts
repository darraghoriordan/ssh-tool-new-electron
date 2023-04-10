import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { HtmlEncoderChannels } from './HtmlEncoderChannelEnum'

export class HtmlEncoderChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('HtmlEncoder', HtmlEncoderChannels.ENCODE_HTML)
  }
}
