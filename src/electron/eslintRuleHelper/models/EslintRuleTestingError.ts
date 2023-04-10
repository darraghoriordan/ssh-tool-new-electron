class EslintRuleTestingError extends Error {
  constructor(message: string, public readonly source: ErrorSource) {
    super(message)
    this.name = 'EslintRuleTestingError'
  }
}
export default EslintRuleTestingError

export type ErrorSource = 'tsc' | 'eslint-test' | 'system'
