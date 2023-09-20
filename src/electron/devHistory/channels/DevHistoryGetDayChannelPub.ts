import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { DevHistoryChannels } from './DevHistoryChannelEnum'

export class DevHistoryGetDayChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('DevHistory', DevHistoryChannels.GET_DAY)
  }
}
