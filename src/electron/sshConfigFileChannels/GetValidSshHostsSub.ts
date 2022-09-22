/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron'
import { GetValidSshHostsResponseMessage } from './MessageTypes'
import { SshConfigFileLoader } from '../services/sshConfigFile/SshConfigFileLoader'
import { GetValidSshHostsPub } from './GetValidSshHostsPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'
import { ApplicationSettingService } from '../appSettings/services/ApplicationSettingService'

export class GetValidSshHostsSub
  extends GetValidSshHostsPub
  implements IIpcMainInvokeEventSub<void, GetValidSshHostsResponseMessage>
{
  async handle(
    event: IpcMainEvent,
    request: void
  ): Promise<GetValidSshHostsResponseMessage> {
    const settings = await ApplicationSettingService.getSettings()

    const response: GetValidSshHostsResponseMessage = {
      path: settings.sshConfigFilePath,
      contents: undefined,
      found: true,
    }
    // blurgh - need to refactor al these paths and things
    response.contents = await SshConfigFileLoader.load()
    response.found = true

    console.log('returning response', response)
    return response
  }
}
