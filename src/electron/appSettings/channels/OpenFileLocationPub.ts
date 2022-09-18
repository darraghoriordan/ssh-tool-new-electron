import { SendChannelBasePub } from '../../IpcChannelTypes/SendChannelBasePub'
import { AppSettingsChannels } from './AppSettingsChannelEnum'

export class OpenFileLocationPub extends SendChannelBasePub {
  constructor() {
    super('OpenFileLocation', AppSettingsChannels.OPEN_FILE_LOCATION)
  }
}
