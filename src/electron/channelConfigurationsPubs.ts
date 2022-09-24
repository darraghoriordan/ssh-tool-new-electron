import { LoadSettingsChannelPub } from './appSettings/channels/LoadSettingsChannelPub'
import { SaveSettingsChannelPub } from './appSettings/channels/SaveSettingsChannelPub'
import { GetValidSshHostsPub } from './sshConfigFileChannels/GetValidSshHostsPub'
import { SimpleMessagePub } from './simpleMessage/SimpleMessagePub'
import { OpenSshConfigFilePub } from './sshConfigFileChannels/OpenSshConfigFilePub'
import { ChannelConfigurationTypePub } from './ChannelConfigurationTypePub'
import { GitConfigFilesListPub } from './gitConfigurations/channels/GitConfigFilesListPub'
import { ResetSettingsChannelPub } from './appSettings/channels/ResetSettingsChannelPub'
import { OpenFileLocationPub } from './appSettings/channels/OpenFileLocationPub'
import { RescanGitConfigsChannelPub } from './gitConfigurations/channels/RescanGitConfigsChannelPub'
import { DecodeJwtChannelPub } from './jwtDecoder/channels/DecodeJwtChannelPub'
import { EscapeJsonChannelPub } from './jsonEncoder/channels/EscapeJsonChannelPub'
import { Base64EncoderChannelPub } from './base64Encoder/channels/Base64EncoderChannelPub'
import { UnixTimeConverterChannelPub } from './unixTimeConverter/channels/UnixTimeConverterChannelPub'

export const ChannelConfigurationPubs: ChannelConfigurationTypePub = {
  rtmSendChannels: [new SimpleMessagePub(), new OpenFileLocationPub()],
  rtmInvokeChannels: [
    new OpenSshConfigFilePub(),
    new GitConfigFilesListPub(),
    new GetValidSshHostsPub(),
    new LoadSettingsChannelPub(),
    new SaveSettingsChannelPub(),
    new ResetSettingsChannelPub(),
    new RescanGitConfigsChannelPub(),
    new DecodeJwtChannelPub(),
    new EscapeJsonChannelPub(),
    new Base64EncoderChannelPub(),
    new UnixTimeConverterChannelPub(),
  ],
}
