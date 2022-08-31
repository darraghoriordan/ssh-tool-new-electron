import { RemoveCertMessage, RemoveCertResponse } from './MessageTypes'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'
import { CertChannels } from './CertChannelEnum'

export class RemoveCertFromSshAgentPub extends InvokeChannelBasePub<
  RemoveCertMessage,
  RemoveCertResponse
> {
  constructor() {
    super('RemoveCertFromSshAgent', CertChannels.REMOVE_CERT_FROM_SSH_AGENT)
  }
}
