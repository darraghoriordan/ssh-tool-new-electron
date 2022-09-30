import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SaveUserSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('SaveUserSettings', UserSettingsChannels.SAVE_USER_SETTINGS)
  }
}
