import { DecodeJwtResponse } from './channels/MessageTypes'

export class JwtDecoder {
  static decode(jwt: string): DecodeJwtResponse {
    const [header, payload, signature] = jwt.split('.')

    return {
      algorithm: JSON.parse(JwtDecoder.decodeBase64(header)),
      payload: JSON.parse(JwtDecoder.decodeBase64(payload)),
      signature: JwtDecoder.decodeBase64(signature),
    }
  }

  static decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString('utf8')
  }
}
