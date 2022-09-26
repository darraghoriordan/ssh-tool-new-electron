import ini from 'ini'
import { GitUser } from '../models/GitUser'
import os from 'os'

export class GitConfigFileEditor {
  static convertToIniFormat(gitUser: GitUser | undefined): string | undefined {
    if (!gitUser) {
      return undefined
    }

    const encodedIni = ini.stringify(
      {
        user: {
          name: gitUser.name,
          email: gitUser.email,
        },
      },
      { whitespace: true }
    )

    return encodedIni
  }
}
