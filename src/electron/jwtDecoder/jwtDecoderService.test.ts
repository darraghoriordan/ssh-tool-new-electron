import { DecodeJwtResponse } from './channels/MessageTypes'
import { JwtDecoder } from './jwtDecoderService'

describe('jwtDecoderService', () => {
  const expected = {
    algorithm: { alg: 'HS256', typ: 'JWT' },
    payload: {
      iss: 'toptal.com',
      exp: 1426420800,
      ['http://toptal.com/jwt_claims/is_admin']: true,
      company: 'Toptal',
      awesome: true,
    },
    signature: '��l�&T��B�V�%3(B��׌�e|',
  }

  test.each([
    [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ0b3B0YWwuY29tIiwiZXhwIjoxNDI2NDIwODAwLCJodHRwOi8vdG9wdGFsLmNvbS9qd3RfY2xhaW1zL2lzX2FkbWluIjp0cnVlLCJjb21wYW55IjoiVG9wdGFsIiwiYXdlc29tZSI6dHJ1ZX0.yRQYnWzskCZUxPwaQupWkiUzKELZ49eM7oWxAQK_ZXw',
      expected,
    ],
  ])(
    'is an expected response',
    (input: string, expected: DecodeJwtResponse) => {
      const result = JwtDecoder.decode(input)

      expect(result.algorithm).toEqual(expected.algorithm)
      expect(result.payload).toEqual(expected.payload)
      // cannot match on the signature
    }
  )
})
