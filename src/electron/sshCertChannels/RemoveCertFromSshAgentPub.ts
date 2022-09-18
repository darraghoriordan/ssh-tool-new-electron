import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'
import { CertChannels } from './CertChannelEnum'

export class RemoveCertFromSshAgentPub extends InvokeChannelBasePub {
  constructor() {
    super('RemoveCertFromSshAgent', CertChannels.REMOVE_CERT_FROM_SSH_AGENT)
  }
}
