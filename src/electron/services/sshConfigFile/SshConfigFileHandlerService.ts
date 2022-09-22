import { OpenFileResponseMessage } from '../../sshConfigFileChannels/MessageTypes'
import SshConfigFileDiskLoader from './SshConfigFileDiskLoader'
import { SshConfigFileParser } from './SshConfigFileParser'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'

export class SshConfigFileHandler {
  public static async readAllFromFile() {
    const settings = await ApplicationSettingService.getSettings()
    const sshFilePath = settings.sshConfigFilePath

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
