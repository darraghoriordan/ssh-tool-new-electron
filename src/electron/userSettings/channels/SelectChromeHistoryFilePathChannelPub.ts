import { UserSettingsChannels } from './UserSettingsChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SelectChromeHistoryFilePathChannelPub extends InvokeChannelBasePub {
  constructor() {
    super(
      'SelectChromeHistoryFilePath',
      UserSettingsChannels.SELECT_CHROME_HISTORY_PATH,
    )
  }
}
