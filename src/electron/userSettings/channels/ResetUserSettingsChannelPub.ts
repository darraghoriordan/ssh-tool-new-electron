import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class ResetUserSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('ResetUserSettings', UserSettingsChannels.RESET_USER_SETTINGS)
  }
}
