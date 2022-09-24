import SshConfigFileDiskLoader from './SshConfigFileDiskLoader'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'

export class SshUrlConverterService {
  public static async getPossibleSshUrls(inputUrl: string): Promise<string[]> {
    const settings = await ApplicationSettingService.getSettings()

    const rawFileContents = SshConfigFileDiskLoader.loadFromPath(
      settings.sshConfigFilePath
    )

    const results = [] as string[]
    return results
  }
}
