/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent, app } from 'electron'
import { GetValidSshHostsResponseMessage } from './MessageTypes'
import path from 'path'
import { SshConfigFileLoader } from '../services/sshConfigFile/SshConfigFileLoader'
import { GetValidSshHostsPub } from './GetValidSshHostsPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSube'

export class GetValidSshHostsSub
  extends GetValidSshHostsPub
  implements IIpcMainInvokeEventSub<void, GetValidSshHostsResponseMessage>
{
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
