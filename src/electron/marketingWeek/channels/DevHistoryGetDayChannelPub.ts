import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { DevHistoryChannels } from './DevHistoryChannelEnum'

export class DevHistoryGetDayChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('GetDevHistorySingleDay', DevHistoryChannels.GET_DAY)
  }
}
