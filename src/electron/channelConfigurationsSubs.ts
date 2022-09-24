import { LoadSettingsChannelSub } from './appSettings/channels/LoadSettingsChannelSub'
import { OpenFileLocationSub } from './appSettings/channels/OpenFileLocationSub'
import { ResetSettingsChannelSub } from './appSettings/channels/ResetSettingsChannelSub'
import { SaveSettingsChannelSub } from './appSettings/channels/SaveSettingsChannelSub'
import { Base64EncoderChannelSub } from './base64Encoder/channels/Base64EncoderChannelSub'
import { GitConfigFilesListSub } from './gitConfigurations/channels/GitConfigFilesListSub'
import { RescanGitConfigsChannelSub } from './gitConfigurations/channels/RescanGitConfigsChannelSub'
import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'
import { EscapeJsonChannelSub } from './jsonEncoder/channels/EscapeJsonChannelSub'
import { DecodeJwtChannelSub } from './jwtDecoder/channels/DecodeJwtChannelSub'
import { SimpleMessageSub } from './simpleMessage/SimpleMessageSub'
import { SshUrlConverterChannelSub } from './sshConfigFile/channels/SshUrlConverterChannelSub'
import { UnixTimeConverterChannelSub } from './unixTimeConverter/channels/UnixTimeConverterChannelSub'

export type ChannelConfigurationTypeSub = {
  rtmSendChannels: IIpcMainSendEventSub<unknown>[]
  rtmInvokeChannels: IIpcMainInvokeEventSub<unknown, unknown>[]
}

export const ChannelConfigurationSubs: ChannelConfigurationTypeSub = {
  rtmSendChannels: [new SimpleMessageSub(), new OpenFileLocationSub()],
  rtmInvokeChannels: [
    new GitConfigFilesListSub(),
    new SshUrlConverterChannelSub(),
    new LoadSettingsChannelSub(),
    new SaveSettingsChannelSub(),
    new ResetSettingsChannelSub(),
    new RescanGitConfigsChannelSub(),
    new DecodeJwtChannelSub(),
    new EscapeJsonChannelSub(),
    new Base64EncoderChannelSub(),
    new UnixTimeConverterChannelSub(),
  ],
}
