import { UrlEncoderResponse } from './channels/MessageTypes'

export class UrlEncoder {
  static decodeForUri(input: string): UrlEncoderResponse {
    const trimmedInput = input.trim()

    const decoded = decodeURI(trimmedInput)
    return {
      result: decoded,
    }
  }

  static encodeForUri(input: string): UrlEncoderResponse {
    const trimmedInput = input.trim()

    const encoded = encodeURI(trimmedInput)
    return {
      result: encoded,
    }
  }

  static decodeForUriComponent(input: string): UrlEncoderResponse {
    const trimmedInput = input.trim()

    const decoded = decodeURIComponent(trimmedInput)
    return {
      result: decoded,
    }
  }

  static encodeForUriComponent(input: string): UrlEncoderResponse {
    const trimmedInput = input.trim()

    const encoded = encodeURIComponent(trimmedInput)
    return {
      result: encoded,
    }
  }
}
