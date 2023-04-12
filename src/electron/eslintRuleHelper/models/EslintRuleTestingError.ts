class EslintRuleTestingError extends Error {
  constructor(
    message: string,
    public readonly source: ErrorSource,
    public readonly recoverable: boolean
  ) {
    super(message)
    this.recoverable = recoverable
    this.name = 'EslintRuleTestingError'
  }
}
export default EslintRuleTestingError

export type ErrorSource = 'tsc' | 'eslint-test' | 'system' | 'chat-gpt'
