import { StringCases } from './channels/MessageTypes'
import { StringCase } from './StringCaseService'

describe('UrlEncoderService', () => {
  test.each([
    [`abcd-dfer`, StringCases.camel, `abcdDfer`],
    [`Abcd 1234`, StringCases.capital, `Abcd 1234`],
    [`aDBd 1234`, StringCases.constant, `ADBD_1234`],
    [`abcdFF 1234`, StringCases.header, `AbcdFF-1234`],
    [`abcd_1234 dbFRR`, StringCases.kebab, `abcd-1234-dbfrr`],
    [`ABCD 1234 aB`, StringCases.lower, `abcd 1234 ab`],
    [`abcd_FGH`, StringCases.pascal, `AbcdFGH`],
    [`abcd 1234`, StringCases.sentence, `Abcd 1234`],
    [`abcd 1234`, StringCases.snake, `abcd_1234`],
    [`abcd 1234 abcd`, StringCases.title, `Abcd 1234 Abcd`],
    [`abcd 1234`, StringCases.upper, `ABCD 1234`],
    [
      `THIS IS A SAMPLE VALUE
    and_another_sample_value
    none more sample value`,
      StringCases.lower,
      `THIS IS A SAMPLE VALUE
    and_another_sample_value
    none more sample value`,
    ],
  ])(
    'is an expected response when changing case',
    (input: string, toCase: StringCases, expected: string) => {
      const result = StringCase.changeCase(input, toCase)

      expect(result.result).toEqual(expected)
    }
  )
})
