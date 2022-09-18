import { GitConfigFileChannels } from '../channels/GitConfigFileChannelsEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class GitConfigFilesListPub extends InvokeChannelBasePub {
  constructor() {
    super('GitConfigFilesList', GitConfigFileChannels.GET_CONFIG_FILE_LIST)
  }
}
