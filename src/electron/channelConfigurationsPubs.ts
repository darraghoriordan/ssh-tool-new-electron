import { LoadSettingsChannelPub } from './appSettings/channels/LoadSettingsChannelPub'
import { SaveSettingsChannelPub } from './appSettings/channels/SaveSettingsChannelPub'
import { SshUrlConverterChannelPub } from './sshConfigFile/channels/SshUrlConverterChannelPub'
import { ChannelConfigurationTypePub } from './ChannelConfigurationTypePub'
import { GitConfigFilesListPub } from './gitConfigurations/channels/GitConfigFilesListPub'
import { ResetSettingsChannelPub } from './appSettings/channels/ResetSettingsChannelPub'
import { OpenFileLocationPub } from './appSettings/channels/OpenFileLocationPub'
import { RescanGitConfigsChannelPub } from './gitConfigurations/channels/RescanGitConfigsChannelPub'
import { DecodeJwtChannelPub } from './jwtDecoder/channels/DecodeJwtChannelPub'
import { EscapeJsonChannelPub } from './jsonEncoder/channels/EscapeJsonChannelPub'
import { Base64EncoderChannelPub } from './base64Encoder/channels/Base64EncoderChannelPub'
import { UnixTimeConverterChannelPub } from './unixTimeConverter/channels/UnixTimeConverterChannelPub'
import { OpenSubmitFeedbackPub } from './appSettings/channels/OpenSubmitFeedbackPub'

export const ChannelConfigurationPubs: ChannelConfigurationTypePub = {
  rtmSendChannels: [new OpenFileLocationPub(), new OpenSubmitFeedbackPub()],
  rtmInvokeChannels: [
    new GitConfigFilesListPub(),
    new SshUrlConverterChannelPub(),
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
