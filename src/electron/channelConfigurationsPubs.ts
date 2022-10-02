import { LoadUserSettingsChannelPub } from './userSettings/channels/LoadUserSettingsChannelPub'
import { SaveUserSettingsChannelPub } from './userSettings/channels/SaveUserSettingsChannelPub'
import { SshUrlConverterChannelPub } from './sshConfigFile/channels/SshUrlConverterChannelPub'
import { ChannelConfigurationTypePub } from './ChannelConfigurationTypePub'
import { GitConfigFilesListPub } from './gitConfigurations/channels/GitConfigFilesListPub'
import { ResetUserSettingsChannelPub } from './userSettings/channels/ResetUserSettingsChannelPub'
import { OpenFileLocationPub } from './appSupport/OpenFileLocationPub'
import { RescanGitConfigsChannelPub } from './gitConfigurations/channels/RescanGitConfigsChannelPub'
import { DecodeJwtChannelPub } from './jwtDecoder/channels/DecodeJwtChannelPub'
import { EscapeJsonChannelPub } from './jsonEncoder/channels/EscapeJsonChannelPub'
import { Base64EncoderChannelPub } from './base64Encoder/channels/Base64EncoderChannelPub'
import { UnixTimeConverterChannelPub } from './unixTimeConverter/channels/UnixTimeConverterChannelPub'
import { OpenSubmitFeedbackPub } from './appSupport/OpenSubmitFeedbackPub'
import { LoadAppSettingsChannelPub } from './appSettings/channels/LoadAppSettingsChannelPub'
import { SetFirstAppUsageDatePub } from './appSettings/channels/SetFirstAppUsageDatePub'
import { LoadLicensingChannelPub } from './licencing/channels/LoadLicensingChannelPub'
import { SetLicenseKeyChannelPub } from './licencing/channels/SetLicenceKeyChannelPub'

export const ChannelConfigurationPubs: ChannelConfigurationTypePub = {
  rtmSendChannels: [
    // appSupport
    new OpenFileLocationPub(),
    new OpenSubmitFeedbackPub(),
  ],
  rtmInvokeChannels: [
    // userSettings
    new LoadUserSettingsChannelPub(),
    new SaveUserSettingsChannelPub(),
    new ResetUserSettingsChannelPub(),
    // appSettings
    new LoadAppSettingsChannelPub(),
    new SetFirstAppUsageDatePub(),
    // licencing
    new LoadLicensingChannelPub(),
    new SetLicenseKeyChannelPub(),
    // features
    new GitConfigFilesListPub(),
    new RescanGitConfigsChannelPub(),
    new SshUrlConverterChannelPub(),
    new DecodeJwtChannelPub(),
    new EscapeJsonChannelPub(),
    new Base64EncoderChannelPub(),
    new UnixTimeConverterChannelPub(),
  ],
}
