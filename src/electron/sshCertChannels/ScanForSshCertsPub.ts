import { CertChannels } from './CertChannelEnum'
import { ScanForSshCertsResponse } from '../services/sshCertificates/Types'
import { ScanForSshCertsMessage } from './MessageTypes'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'
export class ScanForSshCertsPub extends InvokeChannelBasePub<
  ScanForSshCertsMessage,
  ScanForSshCertsResponse
> {
  constructor() {
    super('ScanForSshCerts', CertChannels.SCAN_FOR_CERTS)
  }
}
