import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { StringSorterChannels } from './StringSorterChannelEnum'

export class StringSorterChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('StringSorter', StringSorterChannels.STRING_SORTER)
  }
}
