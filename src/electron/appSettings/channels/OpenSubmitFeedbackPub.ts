import { SendChannelBasePub } from '../../IpcChannelTypes/SendChannelBasePub'
import { AppSettingsChannels } from './AppSettingsChannelEnum'

export class OpenSubmitFeedbackPub extends SendChannelBasePub {
  constructor() {
    super('OpenSubmitFeedback', AppSettingsChannels.OPEN_SUBMIT_FEEDBACK)
  }
}
