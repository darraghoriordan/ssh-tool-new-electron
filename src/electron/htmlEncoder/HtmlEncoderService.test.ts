import { HtmlEncoder, HtmlEncoderType } from './HtmlEncoderService'

describe('HtmlEncoderService', () => {
  test.each([
    [
      '转换成 Unicode',
      'unicode' as HtmlEncoderType,
      `\\u8F6C\\u6362\\u6210 Unicode`,
    ],
    [
      '< > html entity',
      'html-entity' as HtmlEncoderType,
      `&lt; &gt; html entity`,
    ],
  ])(
    'is an expected response when encoding',
    (input: string, type: HtmlEncoderType, expected: string) => {
      const result = HtmlEncoder.encode(input, type)

      expect(result.result).toEqual(expected)
    }
  )

  test.each([
    [
      `\\u8F6C\\u6362\\u6210 Unicode`,
      'unicode' as HtmlEncoderType,
      '转换成 Unicode',
    ],
    [
      `&lt; &gt; html entity`,
      'html-entity' as HtmlEncoderType,
      '< > html entity',
    ],
  ])(
    'is an expected response when decoding',
    (input: string, type: HtmlEncoderType, expected: string) => {
      const result = HtmlEncoder.decode(input, type)

      expect(result.result).toEqual(expected)
    }
  )
})
