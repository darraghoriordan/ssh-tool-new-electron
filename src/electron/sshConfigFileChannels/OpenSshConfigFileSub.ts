/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron'
import { OpenFileResponseMessage } from './MessageTypes'
import { SshConfigFileHandler } from '../services/sshConfigFile/SshConfigFileHandlerService'
import { OpenSshConfigFilePub } from './OpenSshConfigFilePub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'

export class OpenSshConfigFileSub
  extends OpenSshConfigFilePub
  implements IIpcMainInvokeEventSub<void, OpenFileResponseMessage>
{
  async handle(
    event: IpcMainEvent,
    request: void
  ): Promise<OpenFileResponseMessage> {
    return SshConfigFileHandler.readAllFromFile()
  }
}
