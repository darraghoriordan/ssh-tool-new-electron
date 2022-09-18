/* eslint-disable no-unused-vars */
import { CertChannels } from './CertChannelEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class AddCertToSshAgentPub extends InvokeChannelBasePub {
  constructor() {
    super('AddCertToSshAgent', CertChannels.ADD_CERT_TO_SSH_AGENT)
  }
}
