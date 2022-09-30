import { SendChannelBasePub } from '../IpcChannelTypes/SendChannelBasePub'
import { AppSupportChannels } from './AppSupportChannelEnum'

export class OpenSubmitFeedbackPub extends SendChannelBasePub {
  constructor() {
    super('OpenSubmitFeedback', AppSupportChannels.OPEN_SUBMIT_FEEDBACK)
  }
}
