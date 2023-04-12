import { FailingTest } from './FailingTest'

class EslintRuleGeneratorMeta {
  constructor() {
    this.criteria = []
    this.passingExamples = []
    this.failingExamples = []
    this.maxNumberOfEpochs = 15
    this.requestDate = new Date()
  }

  criteria: string[]
  passingExamples: string[]
  failingExamples: FailingTest[]
  maxNumberOfEpochs: number
  requestDate: Date
}

export default EslintRuleGeneratorMeta
