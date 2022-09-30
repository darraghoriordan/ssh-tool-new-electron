import { AppSettingsChannels } from './AppSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class LoadAppSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('LoadAppSettings', AppSettingsChannels.LOAD_APP_SETTINGS)
  }
}
