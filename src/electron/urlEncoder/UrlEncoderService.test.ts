import { UrlEncoder } from './UrlEncoderService'

describe('UrlEncoderService', () => {
  test.each([
    [
      `http://www.example.com/?foo=bar&baz=q ux&baz=q  uux&cor$##ge`,
      `http://www.example.com/?foo=bar&baz=q%20ux&baz=q%20%20uux&cor$##ge`,
    ],
  ])(
    'is an expected response when encoding full uri',
    (input: string, expected: string) => {
      const result = UrlEncoder.encodeForUri(input)

      expect(result.result).toEqual(expected)
    }
  )

  test.each([
    [
      `http://www.example.com/?foo=bar&baz=q%20ux&baz=q%20%20uux&cor$##ge`,
      `http://www.example.com/?foo=bar&baz=q ux&baz=q  uux&cor$##ge`,
    ],
  ])(
    'is an expected response when decoding a full uri',
    (input: string, expected: string) => {
      const result = UrlEncoder.decodeForUri(input)

      expect(result.result).toEqual(expected)
    }
  )

  test.each([
    [
      `http://www.example.com/?foo=bar&baz=qux&baz=quux&corge`,
      `http%3A%2F%2Fwww.example.com%2F%3Ffoo%3Dbar%26baz%3Dqux%26baz%3Dquux%26corge`,
    ],
  ])(
    'is an expected response when encoding a uri component',
    (input: string, expected: string) => {
      const result = UrlEncoder.encodeForUriComponent(input)

      expect(result.result).toEqual(expected)
    }
  )

  test.each([
    [
      `http%3A%2F%2Fwww.example.com%2F%3Ffoo%3Dbar%26baz%3Dqux%26baz%3Dquux%26corge`,
      `http://www.example.com/?foo=bar&baz=qux&baz=quux&corge`,
    ],
  ])(
    'is an expected response when decoding a uri component',
    (input: string, expected: string) => {
      const result = UrlEncoder.decodeForUriComponent(input)

      expect(result.result).toEqual(expected)
    }
  )
})
