/* eslint-disable @typescript-eslint/no-unused-vars */
import { IpcMainEvent } from 'electron'
import { SshUrlConverterService } from '../services/SshUrlConverterService'
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

    const possibleSshUrls = await SshUrlConverterService.getPossibleSshUrls(
      request.gitUrl
    )
    const response: SshUrlConverterChannelResponse = {
      possibleGitUrls: possibleSshUrls,
    }

    return response
  }
}
