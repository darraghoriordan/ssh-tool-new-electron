/* eslint-disable no-unused-vars */
import { AddCertMessage, AddCertResponse } from './MessageTypes'
import { CertChannels } from './CertChannelEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class AddCertToSshAgentPub extends InvokeChannelBasePub<
  AddCertMessage,
  AddCertResponse
> {
  constructor() {
    super('AddCertToSshAgent', CertChannels.ADD_CERT_TO_SSH_AGENT)
  }
}
