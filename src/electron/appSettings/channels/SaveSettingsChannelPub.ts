import { AppSettingsChannels } from '../AppSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SaveSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('SaveSettings', AppSettingsChannels.SAVE_SETTINGS)
  }
}
