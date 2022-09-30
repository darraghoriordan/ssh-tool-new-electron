import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class LoadUserSettingsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('LoadUserSettings', UserSettingsChannels.LOAD_USER_SETTINGS)
  }
}
