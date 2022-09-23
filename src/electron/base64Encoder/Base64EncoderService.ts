import { Base64EncoderResponse } from './channels/MessageTypes'

export class Base64Encoder {
  static decode(input: string): Base64EncoderResponse {
    const decoded = Buffer.from(input, 'base64').toString('utf8')
    return {
      result: decoded,
    }
  }

  static encode(input: string): Base64EncoderResponse {
    const encoded = Buffer.from(input).toString('base64')
    return {
      result: encoded,
    }
  }
}
