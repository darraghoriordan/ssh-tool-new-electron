import { FailingTest } from './FailingTest'

class EslintRuleGeneratorMeta {
  constructor() {
    this.criteria = []
    this.passingExamples = []
    this.failingExamples = []
    this.maxNumberOfEpochs = 1
  }

  criteria: string[]
  passingExamples: string[]
  failingExamples: FailingTest[]
  maxNumberOfEpochs: number
}

export default EslintRuleGeneratorMeta
