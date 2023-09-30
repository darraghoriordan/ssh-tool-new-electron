import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SelectSshConfigFilePathChannelPub extends InvokeChannelBasePub {
  constructor() {
    super(
      'SelectSshConfigFilePath',
      UserSettingsChannels.SELECT_SSH_CONFIG_FILE_PATH,
    )
  }
}
