import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { DevHistoryChannels } from './DevHistoryChannelEnum'

export class GitActivityForMonthChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('GitActivityForMonth', DevHistoryChannels.GET_GIT_ACTIVITY_FOR_MONTH)
  }
}
