import { GitUser } from '../models/GitUser'
import { GitConfigFileEditor } from './GitConfigFileEditor'

describe('GitConfigFileEditor', () => {
  const gitUser = {
    name: 'John Doe',
    email: 'doe@email.com',
  }
  const expected = `[user]
name = John Doe
email = doe@email.com
`

  test.each([[gitUser, expected]])(
    'it can convert a git user',
    (input: GitUser, expected: string) => {
      const result = GitConfigFileEditor.convertToIniFormat(input)
      expect(result).toEqual(expected)
    }
  )
})
