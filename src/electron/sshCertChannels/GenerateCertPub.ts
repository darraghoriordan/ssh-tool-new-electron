import { GenerateCertMessage, GenerateCertResponse } from './MessageTypes'
import { CertChannels } from './CertChannelEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class GenerateCertPub extends InvokeChannelBasePub<
  GenerateCertMessage,
  GenerateCertResponse
> {
  constructor() {
    super('GenerateCert', CertChannels.GENERATE_NEW_CERT)
  }
}
