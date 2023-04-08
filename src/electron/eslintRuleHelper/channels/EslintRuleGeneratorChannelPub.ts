import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { EslintRuleHelperChannels } from './EslintRuleHelperChannelEnum'

export class EslintRuleHelperChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('EslintRuleGenerator', EslintRuleHelperChannels.GENERATE_RULE)
  }
}
