import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SelectGitConfigFilePathChannelPub extends InvokeChannelBasePub {
  constructor() {
    super(
      'SelectGitConfigFilePath',
      UserSettingsChannels.SELECT_GIT_CONFIG_FILE_PATH,
    )
  }
}
