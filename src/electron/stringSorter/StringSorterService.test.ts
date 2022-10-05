import { StringSorter } from './StringSorterService'
import os from 'os'

describe('StringSorterService', () => {
  test.each([
    [
      `c${os.EOL}a${os.EOL}b${os.EOL}3${os.EOL}4${os.EOL}1`,
      true,
      `1${os.EOL}3${os.EOL}4${os.EOL}a${os.EOL}b${os.EOL}c`,
    ],
    [
      `c${os.EOL}a${os.EOL}b${os.EOL}3${os.EOL}4${os.EOL}1`,
      false,
      `c${os.EOL}b${os.EOL}a${os.EOL}4${os.EOL}3${os.EOL}1`,
    ],
    [
      `c${os.EOL}a${os.EOL}A${os.EOL}3${os.EOL}4${os.EOL}1`,
      true,
      `1${os.EOL}3${os.EOL}4${os.EOL}a${os.EOL}A${os.EOL}c`,
    ],
    [`c\na\nA\n3\n4\n1`, true, `1\n3\n4\na\nA\nc`],

    [`c\r\na\r\nA\r\n3\r\n4\r\n1`, true, `1\r\n3\r\n4\r\na\r\nA\r\nc`],
  ])(
    'is an expected response when sorting',
    (input: string, asc: boolean, expected: string) => {
      const result = StringSorter.sortByNewLine(input, asc)

      expect(result.result).toEqual(expected)
    }
  )
})
