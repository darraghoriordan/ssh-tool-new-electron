import { EscapeJsonResponse } from './channels/MessageTypes'

export class JsonEscaper {
  static unescapeJson(input: string): EscapeJsonResponse {
    const trimmedInput = input.trim()

    const unescapedString = trimmedInput
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
    return {
      result: unescapedString,
    }
  }

  static escapeJson(input: string): EscapeJsonResponse {
    const trimmedInput = input.trim()

    const stringifiedInput = JSON.stringify(trimmedInput)
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
