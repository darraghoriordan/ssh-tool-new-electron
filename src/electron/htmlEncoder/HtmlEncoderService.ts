import { HtmlEncoderResponse } from './channels/MessageTypes'
import { encode, decode } from 'html-entities'

export type HtmlEncoderType = 'unicode' | 'html-entity'
export class HtmlEncoder {
  static decode(input: string, type: HtmlEncoderType): HtmlEncoderResponse {
    const trimmedInput = input.trim()
    if (type === 'html-entity') {
      return {
        result: decode(trimmedInput, { level: 'html5' }),
      }
    }

    if (type === 'unicode') {
      return {
        result: HtmlEncoder.toStringFromUnicode(trimmedInput),
      }
    }
    throw new Error('Invalid type provided')
  }
  static encode(input: string, type: HtmlEncoderType): HtmlEncoderResponse {
    const trimmedInput = input.trim()

    if (type === 'unicode') {
      return {
        result: HtmlEncoder.toUnicodeFromString(trimmedInput),
      }
    }
    if (type === 'html-entity') {
      return {
        result: encode(trimmedInput, { mode: 'nonAsciiPrintable' }),
      }
    }

    throw new Error('Invalid type provided')
  }

  static toStringFromUnicode(input: string) {
    return input.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
  }

  static toUnicodeFromString(str: string) {
    return str
      .split('')
      .map(function (value, index, array) {
        const temp = value.charCodeAt(0).toString(16).toUpperCase()
        if (temp.length > 2) {
          return '\\u' + temp
        }
        return value
      })
      .join('')
  }
}
