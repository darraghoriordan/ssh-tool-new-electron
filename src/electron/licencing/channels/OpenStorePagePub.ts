import { SendChannelBasePub } from '../../IpcChannelTypes/SendChannelBasePub'
import { LicensingChannels } from './LicensingChannelEnum'

export class OpenStorePagePub extends SendChannelBasePub {
  constructor() {
    super('OpenStorePage', LicensingChannels.OPEN_STORE)
  }
}
