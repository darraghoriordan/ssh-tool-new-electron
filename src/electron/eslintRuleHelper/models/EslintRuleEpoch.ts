import { ChatMessage } from './ChatMessage'

export class EslintRuleEpoch {
  constructor(epochNumber: number, code: string, tokensUsed: number) {
    this.chatMessages = []
    this.errors = []
    this.epoch = epochNumber
    this.code = code
    this.tokensUsed = tokensUsed
  }
  epoch: number
  tokensUsed: number
  code: string
  chatMessages: ChatMessage[]
  errors: string[]
}
