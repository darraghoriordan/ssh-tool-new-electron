import { format } from 'date-fns'
import { EslintRuleEpoch } from './EslintRuleEpoch'
import EslintRuleGeneratorMeta from './EslintRuleGeneratorMeta'

class EslintRuleGenerationRecord {
  constructor() {
    this.epochs = []
    this.created = new Date()
    this.createdForFilename = format(this.created, 'yyyyMMdd-HHmmss-SS')
    this.meta = new EslintRuleGeneratorMeta()
  }
  created!: Date
  createdForFilename!: string
  meta!: EslintRuleGeneratorMeta
  epochs!: EslintRuleEpoch[]
}

export default EslintRuleGenerationRecord
