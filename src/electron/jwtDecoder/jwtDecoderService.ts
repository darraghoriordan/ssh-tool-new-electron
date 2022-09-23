import { DecodeJwtResponse } from './channels/MessageTypes'
import * as jose from 'jose'

export class JwtDecoder {
  static decode(jwt: string): DecodeJwtResponse {
    const [alg, payload, signature] = jwt.split('.')

    return {
      algorithm: jose.decodeProtectedHeader(jwt),
      payload: jose.decodeJwt(jwt),
      signature: JwtDecoder.decodeBase64(signature),
    }
  }

  static decodeBase64(base64: string): string {
    return Buffer.from(base64, 'base64').toString('utf8')
  }
}
