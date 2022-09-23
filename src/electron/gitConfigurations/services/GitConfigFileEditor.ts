import ini from 'ini'
import { GitUser } from '../models/GitUser'

export class GitConfigFileEditor {
  static convertToIniFormat(gitUser: GitUser | undefined): string | undefined {
    if (!gitUser) {
      return undefined
    }

    return ini.stringify(
      {
        user: {
          name: gitUser.name,
          email: gitUser.email,
        },
      },
      { whitespace: true }
    )
  }
}
