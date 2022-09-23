import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { UnixTimeConverterChannels } from './UnixTimeConverterChannelEnum'

export class UnixTimeConverterChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('UnixTimeConverter', UnixTimeConverterChannels.CONVERT_UNIX_TIME)
  }
}
