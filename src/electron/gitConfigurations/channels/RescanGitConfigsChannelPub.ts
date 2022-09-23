import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { GitConfigFileChannels } from './GitConfigFileChannelsEnum'

export class RescanGitConfigsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('RescanGithubConfigs', GitConfigFileChannels.RE_SCAN)
  }
}
