import { EscapeJsonResponse } from './channels/MessageTypes'

export class JsonEscaper {
  static unescapeJson(input: string): EscapeJsonResponse {
    const unescapedString = input.replace(/\\"/g, '"').replace(/\\'/g, "'")
    return {
      result: unescapedString,
    }
  }

  static escapeJson(input: string): EscapeJsonResponse {
    const stringifiedInput = JSON.stringify(input)
    const escapedString = stringifiedInput
      .replace(/\\n/g, '\\n')
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, '\\&')
      .replace(/\\r/g, '\\r')
      .replace(/\\t/g, '\\t')
      .replace(/\\b/g, '\\b')
      .replace(/\\f/g, '\\f')
    return {
      result: escapedString,
    }
  }
}
