/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron'
import { SshConfigFileLoader } from '../services/SshConfigFileLoader'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { SshUrlConverterChannelPub } from './SshUrlConverterChannelPub'
import {
  SshUrlConverterChannelMessage,
  SshUrlConverterChannelResponse,
} from './MessageTypes'

export class SshUrlConverterChannelSub
  extends SshUrlConverterChannelPub
  implements
    IIpcMainInvokeEventSub<
      SshUrlConverterChannelMessage,
      SshUrlConverterChannelResponse
    >
{
  async handle(
    event: IpcMainEvent,
    request: SshUrlConverterChannelMessage
  ): Promise<SshUrlConverterChannelResponse> {
    const settings = await ApplicationSettingService.getSettings()

    const response: SshUrlConverterChannelResponse = { possibleGitUrls: [] }

    const sshConfigs = await SshConfigFileLoader.load()

    return response
  }
}
