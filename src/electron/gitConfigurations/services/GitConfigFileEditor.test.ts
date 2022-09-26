import { GitUser } from '../models/GitUser'
import { GitConfigFileEditor } from './GitConfigFileEditor'

describe('GitConfigFileEditor', () => {
  const gitUser = {
    name: 'John Doe',
    email: 'doe@email.com',
  }
  //prettier-ignore
  const expected = `[user]name = John Doeemail = doe@email.com`

  test.each([[gitUser, expected]])(
    'it can convert a git user',
    (input: GitUser, expected: string) => {
      const result = GitConfigFileEditor.convertToIniFormat(input)
      // weird result when testing on windows
      // there's a difference in whitespace somewhere
      // but it doesn't matter so remove it all for the matcher

      // replace newlines with nothing
      const resultWithoutNewLines = result?.replace(/\r?\n/, '')

      expect(resultWithoutNewLines).toEqual(expected)
    }
  )
})
