import fs from 'fs'

export type SshConfigFileDiskLoaderResponse = {
  path: string
  contents: string | undefined
  found: boolean
}

export default class SshConfigFileDiskLoader {
  static loadFromPath(sshFilePath: string): SshConfigFileDiskLoaderResponse {
    const response: SshConfigFileDiskLoaderResponse = {
      path: sshFilePath,
      contents: undefined,
      found: true,
    }

    // check exists
    if (!fs.existsSync(sshFilePath)) {
      console.error('file not found', sshFilePath)
      response.found = false
    }

    if (response.found) {
      // read contents
      const file = fs.readFileSync(sshFilePath, {
        encoding: 'utf8',
        flag: 'r',
      })
      response.contents = file
    }
    console.log('returning response', response)
    return response
  }
}
