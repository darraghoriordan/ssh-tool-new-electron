import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { LicensingChannels } from './LicensingChannelEnum'

export class SetLicenseKeyChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('SetLicenseKey', LicensingChannels.SET_LICENSE_KEY)
  }
}
