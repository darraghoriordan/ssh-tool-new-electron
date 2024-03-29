import SshConfigFileDiskLoader from '../../sshConfigFile/services/SshConfigFileDiskLoader'
import { AvailableHost, SshConfigFileParser } from './SshConfigFileParser'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'

export class SshConfigFileLoader {
  static async load(): Promise<AvailableHost[]> {
    const settings = await UserSettingsService.getSettings()
    const sshFilePath = settings.sshConfigFilePath

    const rawFileContents = SshConfigFileDiskLoader.loadFromPath(sshFilePath)

    if (!rawFileContents.found) {
      throw new Error("Couldn't parse the ssh config file")
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return SshConfigFileParser.parseValidSshHosts(rawFileContents.contents!)
  }
}
