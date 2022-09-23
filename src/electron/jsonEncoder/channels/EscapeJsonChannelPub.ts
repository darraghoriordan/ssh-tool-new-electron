import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { EscapeJsonChannels } from './EscapeJsonChannelEnum'

export class EscapeJsonChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('EscapeJson', EscapeJsonChannels.ESCAPE_JSON)
  }
}
