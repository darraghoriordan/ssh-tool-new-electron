import { AppSettingsChannels } from './AppSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class ResetSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('ResetSettings', AppSettingsChannels.RESET_SETTINGS)
  }
}
