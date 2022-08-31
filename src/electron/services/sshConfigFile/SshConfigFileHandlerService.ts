import { OpenFileResponseMessage } from '../../sshConfigFileChannels/MessageTypes'
import path from 'path'
import { app } from 'electron'
import SshConfigFileDiskLoader from './SshConfigFileDiskLoader'
import { SshConfigFileParser } from './SshConfigFileParser'

export class SshConfigFileHandler {
  public static readAllFromFile() {
    // TODO: get the ssh file path from settings
    const sshFilePath = path.join(app.getPath('home'), '.ssh', 'config')

    const response: OpenFileResponseMessage = {
      path: sshFilePath,
      contents: undefined,
      found: true,
    }

    const rawFileContents = SshConfigFileDiskLoader.loadFromPath(sshFilePath)
    response.found = rawFileContents.found

    if (rawFileContents.found) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      response.contents = SshConfigFileParser.parse(rawFileContents.contents!)
    }
    console.log('returning response', response)
    return response
  }
}
