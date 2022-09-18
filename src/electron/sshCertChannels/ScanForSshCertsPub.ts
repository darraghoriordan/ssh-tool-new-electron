import { CertChannels } from './CertChannelEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'
export class ScanForSshCertsPub extends InvokeChannelBasePub {
  constructor() {
    super('ScanForSshCerts', CertChannels.SCAN_FOR_CERTS)
  }
}
