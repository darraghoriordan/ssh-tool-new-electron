import SshConfigFileDiskLoader from './SshConfigFileDiskLoader'
import { AvailableHost, SshConfigFileParser } from './SshConfigFileParser'
import path from 'path'
import { app } from 'electron'

export class SshConfigFileLoader {
  static load(): AvailableHost[] {
    // TODO: get the ssh file path from settings
    const sshFilePath = path.join(app.getPath('home'), '.ssh', 'config')

    const rawFileContents = SshConfigFileDiskLoader.loadFromPath(sshFilePath)

    if (!rawFileContents.found) {
      throw new Error("Couldn't parse the ssh config file")
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return SshConfigFileParser.parseValidSshHosts(rawFileContents.contents!)
  }
}
