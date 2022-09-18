import { GitConfigFileChannels } from './GitConfigFileChannelsEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class ScanGitConfigFilesPub extends InvokeChannelBasePub {
  constructor() {
    super('ScanGitConfigFiles', GitConfigFileChannels.SCAN_FOR_CONFIG_FILES)
  }
}
