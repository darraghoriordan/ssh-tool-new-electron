import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'
import { AppSupportChannels } from './AppSupportChannelEnum'

export class CurrentLocalePub extends InvokeChannelBasePub {
  constructor() {
    super('CurrentLocale', AppSupportChannels.GET_CURRENT_LOCALE)
  }
}
