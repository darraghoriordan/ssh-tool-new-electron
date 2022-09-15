import { SettingsResponse } from '../MessageTypes'
import { AppSettingsChannels } from '../AppSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class LoadSettingsChannelPub extends InvokeChannelBasePub<
  void,
  SettingsResponse
> {
  constructor() {
    super('LoadSettings', AppSettingsChannels.LOAD_SETTINGS)
  }
}
