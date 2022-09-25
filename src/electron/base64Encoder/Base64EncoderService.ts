import { Base64EncoderResponse } from './channels/MessageTypes'

export class Base64Encoder {
  static decode(input: string): Base64EncoderResponse {
    const trimmedInput = input.trim()

    const decoded = Buffer.from(trimmedInput, 'base64').toString('utf8')
    return {
      result: decoded,
    }
  }

  static encode(input: string): Base64EncoderResponse {
    const trimmedInput = input.trim()

    const encoded = Buffer.from(trimmedInput).toString('base64')
    return {
      result: encoded,
    }
  }
}
