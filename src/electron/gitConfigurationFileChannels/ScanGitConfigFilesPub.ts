import { GitConfigFileChannels } from './GitConfigFileChannelsEnum'
import {
  GitConfigFileScanRequestMessage,
  GitConfigScanResponseMessage,
} from './MessageTypes'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class ScanGitConfigFilesPub extends InvokeChannelBasePub<
  GitConfigFileScanRequestMessage,
  GitConfigScanResponseMessage
> {
  constructor() {
    super('ScanGitConfigFiles', GitConfigFileChannels.SCAN_FOR_CONFIG_FILES)
  }
}
