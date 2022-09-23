import { Base64Encoder } from './Base64EncoderService'

describe('Base64EncoderService', () => {
  test.each([
    [
      `This is a something 
there is a new line`,
      `VGhpcyBpcyBhIHNvbWV0aGluZyAKdGhlcmUgaXMgYSBuZXcgbGluZQ==`,
    ],
  ])(
    'is an expected response when encoding',
    (input: string, expected: string) => {
      const result = Base64Encoder.encode(input)

      expect(result.result).toEqual(expected)
    }
  )

  test.each([
    [
      `VGhpcyBpcyBhIHNvbWV0aGluZyAKdGhlcmUgaXMgYSBuZXcgbGluZQ==`,
      `This is a something 
there is a new line`,
    ],
  ])(
    'is an expected response when decoding',
    (input: string, expected: string) => {
      const result = Base64Encoder.decode(input)

      expect(result.result).toEqual(expected)
    }
  )
})
