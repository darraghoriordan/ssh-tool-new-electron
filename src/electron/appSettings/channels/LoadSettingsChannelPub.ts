import { AppSettingsChannels } from '../AppSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class LoadSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('LoadSettings', AppSettingsChannels.LOAD_SETTINGS)
  }
}
