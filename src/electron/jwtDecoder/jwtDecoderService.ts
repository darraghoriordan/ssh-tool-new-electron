import { DecodeJwtResponse } from './channels/MessageTypes'
import * as jose from 'jose'

export class JwtDecoder {
  static decode(jwt: string): DecodeJwtResponse {
    const trimmedInput = jwt.trim()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [alg, payload, signature] = trimmedInput.split('.')

    return {
      algorithm: jose.decodeProtectedHeader(trimmedInput),
      payload: jose.decodeJwt(trimmedInput),
      signature: JwtDecoder.decodeBase64(signature),
    }
  }

  static decodeBase64(base64: string): string {
    const trimmedInput = base64.trim()

    return Buffer.from(trimmedInput, 'base64').toString('utf8')
  }
}
