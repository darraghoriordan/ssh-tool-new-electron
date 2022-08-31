import { IpcMainEvent, app, ipcRenderer } from 'electron'
import { SshConfigFileChannels } from './ConfigFileChannelEnum'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { GetValidSshHostsResponseMessage } from './MessageTypes'
import path from 'path'
import { SshConfigFileLoader } from '../services/sshConfigFile/SshConfigFileLoader'

export class GetValidSshHosts
  implements
    IpcMainInvokeEventChannelInterface<void, GetValidSshHostsResponseMessage>
{
  public static ExposedApiName = 'GetValidSshHosts'

  getExposedApiName(): string {
    return GetValidSshHosts.ExposedApiName
  }

  getChannelName(): string {
    return SshConfigFileChannels.GET_VALID_SSH_HOSTS
  }

  async invoke(): Promise<GetValidSshHostsResponseMessage> {
    return ipcRenderer.invoke(SshConfigFileChannels.GET_VALID_SSH_HOSTS)
  }

  async handle(
    event: IpcMainEvent,
    request: void
  ): Promise<GetValidSshHostsResponseMessage> {
    // TODO: get the ssh file path from settings
    const sshFilePath = path.join(app.getPath('home'), '.ssh', 'config')

    const response: GetValidSshHostsResponseMessage = {
      path: sshFilePath,
      contents: undefined,
      found: true,
    }
    // blurgh - need to refactor al these paths and things
    response.contents = SshConfigFileLoader.load()
    response.found = true

    console.log('returning response', response)
    return response
  }
}
