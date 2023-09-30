import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SelectGitProjectsPathChannelPub extends InvokeChannelBasePub {
  constructor() {
    super(
      'SelectGitProjectsPath',
      UserSettingsChannels.SELECT_GIT_PROJECTS_PATH,
    )
  }
}
