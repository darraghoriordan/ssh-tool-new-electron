import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { LicensingChannels } from './LicensingChannelEnum'

export class LoadLicensingChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('LoadLicensing', LicensingChannels.LOAD_LICENSING)
  }
}
