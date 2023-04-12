import { format } from 'date-fns'
import { EslintRuleEpoch } from './EslintRuleEpoch'
import EslintRuleGeneratorMeta from './EslintRuleGeneratorMeta'

class EslintRuleGenerationRecord {
  constructor(ruleMeta: EslintRuleGeneratorMeta) {
    this.epochs = []
    this.createdForFilename = format(ruleMeta.requestDate, 'yyyyMMdd-HHmmss-SS')
    this.meta = ruleMeta
  }

  createdForFilename!: string
  meta!: EslintRuleGeneratorMeta
  epochs!: EslintRuleEpoch[]
}

export default EslintRuleGenerationRecord
