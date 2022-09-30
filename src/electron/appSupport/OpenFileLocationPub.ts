import { SendChannelBasePub } from '../IpcChannelTypes/SendChannelBasePub'
import { AppSupportChannels } from './AppSupportChannelEnum'

export class OpenFileLocationPub extends SendChannelBasePub {
  constructor() {
    super('OpenFileLocation', AppSupportChannels.OPEN_FILE_LOCATION)
  }
}
