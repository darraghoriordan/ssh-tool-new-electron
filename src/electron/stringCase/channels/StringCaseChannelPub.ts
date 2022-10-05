import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { StringCaseChannels } from './StringCaseChannelEnum'

export class StringCaseChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('StringCase', StringCaseChannels.CHANGE_CASE)
  }
}
