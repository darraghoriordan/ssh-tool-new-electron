import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { EslintRuleHelperChannels } from './EslintRuleHelperChannelEnum'

export class ListPastGenerationsChannelPub extends InvokeChannelBasePub {
  constructor() {
    super(
      'EslintListPastGenerations',
      EslintRuleHelperChannels.LIST_PAST_GENERATIONS
    )
  }
}
