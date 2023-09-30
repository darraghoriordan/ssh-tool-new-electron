import { SendChannelBasePub } from '../../IpcChannelTypes/SendChannelBasePub'
import { DevHistoryChannels } from './DevHistoryChannelEnum'

export class OpenDevHistoryCacheLocationPub extends SendChannelBasePub {
  constructor() {
    super('OpenDevHistoryCacheLocation', DevHistoryChannels.OPEN_CACHE_LOCATION)
  }
}
