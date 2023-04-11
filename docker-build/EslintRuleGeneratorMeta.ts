// NOTE - changing this file then you must
// rebuild the docker image and copy the latest
// version in there
class EslintRuleGeneratorMeta {
  constructor() {
    this.criteria = []
    this.passingExamples = []
    this.failingExamples = []
    this.maxNumberOfEpochs = 1
  }

  criteria: string[]
  passingExamples: string[]
  failingExamples: { code: string; errorMessageId: string }[]
  maxNumberOfEpochs: number
}

export default EslintRuleGeneratorMeta
