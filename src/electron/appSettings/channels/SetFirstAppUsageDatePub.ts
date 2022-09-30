import { SendChannelBasePub } from '../../IpcChannelTypes/SendChannelBasePub'
import { AppSettingsChannels } from './AppSettingsChannelEnum'

export class SetFirstAppUsageDatePub extends SendChannelBasePub {
  constructor() {
    super('SetFirstAppUsageDate', AppSettingsChannels.SET_FIRST_APP_USAGE_DATE)
  }
}
