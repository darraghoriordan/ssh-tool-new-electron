import { JsonEscaper } from './JsonEscaperService'

describe('JsonEscaperService', () => {
  // eslint-disable-next-line no-useless-escape
  test.each([[`{\"this\":\"isescaped\"}`, `{"this":"isescaped"}`]])(
    'is an expected response when unescaping',
    (input: string, expected: string) => {
      const result = JsonEscaper.unescapeJson(input)

      expect(result.result).toEqual(expected)
    }
  )
})
