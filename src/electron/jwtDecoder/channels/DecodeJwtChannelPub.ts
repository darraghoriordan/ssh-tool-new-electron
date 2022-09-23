import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { DecodeJwtChannels } from './DecodeJwtChannelEnum'

export class DecodeJwtChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('DecodeJwt', DecodeJwtChannels.DECODE_JWT)
  }
}
