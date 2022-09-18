import { CertChannels } from './CertChannelEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class GenerateCertPub extends InvokeChannelBasePub {
  constructor() {
    super('GenerateCert', CertChannels.GENERATE_NEW_CERT)
  }
}
