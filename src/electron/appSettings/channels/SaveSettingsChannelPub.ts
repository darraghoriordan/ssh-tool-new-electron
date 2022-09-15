import { SaveSettingsMessage, SettingsResponse } from '../MessageTypes'
import { AppSettingsChannels } from '../AppSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SaveSettingsChannelPub extends InvokeChannelBasePub<
  SaveSettingsMessage,
  SettingsResponse
> {
  constructor() {
    super('SaveSettings', AppSettingsChannels.SAVE_SETTINGS)
  }
}
