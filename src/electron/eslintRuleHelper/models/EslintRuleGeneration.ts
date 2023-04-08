import { EslintRuleEpoch } from './EslintRuleEpoch'
import EslintRuleGeneratorMeta from './EslintRuleGeneratorMeta'

class EslintRuleGenerationRecord {
  constructor() {
    this.epochs = []
    this.created = new Date()
    this.meta = new EslintRuleGeneratorMeta()
  }
  created!: Date
  meta!: EslintRuleGeneratorMeta
  epochs!: EslintRuleEpoch[]
}

export default EslintRuleGenerationRecord
