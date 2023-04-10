import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { EslintRuleHelperChannels } from './EslintRuleHelperChannelEnum'

export class GetPastGenerationChannelPub extends InvokeChannelBasePub {
  constructor() {
    super(
      'EslintGetPastGeneration',
      EslintRuleHelperChannels.GET_PAST_GENERATION
    )
  }
}
