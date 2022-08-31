import { IpcMainEvent, app, ipcRenderer } from 'electron'
import { SshConfigFileChannels } from './ConfigFileChannelEnum'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { OpenFileResponseMessage } from './MessageTypes'
import path from 'path'
import { SshConfigFileParser } from '../services/sshConfigFile/SshConfigFileParser'
import SshConfigFileDiskLoader from '../services/sshConfigFile/SshConfigFileDiskLoader'

export class OpenSshConfigFile
  implements IpcMainInvokeEventChannelInterface<void, OpenFileResponseMessage>
{
  public static ExposedApiName = 'OpenSshFile'

  getExposedApiName(): string {
    return OpenSshConfigFile.ExposedApiName
  }

  getChannelName(): string {
    return SshConfigFileChannels.OPEN_CONFIG_FILE
  }

  async invoke(): Promise<OpenFileResponseMessage> {
    return ipcRenderer.invoke(SshConfigFileChannels.OPEN_CONFIG_FILE)
  }

  async handle(
    event: IpcMainEvent,
    request: void
  ): Promise<OpenFileResponseMessage> {
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
      response.contents = SshConfigFileParser.parse(rawFileContents.contents!)
    }
    console.log('returning response', response)
    return response
  }
}
