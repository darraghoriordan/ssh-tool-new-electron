import { OpenFileLocationSub } from './appSupport/OpenFileLocationSub'
import { OpenSubmitFeedbackSub } from './appSupport/OpenSubmitFeedbackSub'
import { LoadAppSettingsChannelSub } from './appSettings/channels/LoadAppSettingsChannelSub'
import { SetFirstAppUsageDateSub } from './appSettings/channels/SetFirstAppUsageDateSub'
import { LoadUserSettingsChannelSub } from './userSettings/channels/LoadUserSettingsChannelSub'
import { ResetUserSettingsChannelSub } from './userSettings/channels/ResetUserSettingsChannelSub'
import { SaveUserSettingsChannelSub } from './userSettings/channels/SaveUserSettingsChannelSub'
import { Base64EncoderChannelSub } from './base64Encoder/channels/Base64EncoderChannelSub'
import { GitConfigFilesListSub } from './gitConfigurations/channels/GitConfigFilesListSub'
import { RescanGitConfigsChannelSub } from './gitConfigurations/channels/RescanGitConfigsChannelSub'
import { EscapeJsonChannelSub } from './jsonEncoder/channels/EscapeJsonChannelSub'
import { DecodeJwtChannelSub } from './jwtDecoder/channels/DecodeJwtChannelSub'
import { SshUrlConverterChannelSub } from './sshConfigFile/channels/SshUrlConverterChannelSub'
import { UnixTimeConverterChannelSub } from './unixTimeConverter/channels/UnixTimeConverterChannelSub'
import { ChannelConfigurationTypeSub } from './ChannelConfigurationTypeSub'
import { LoadLicensingChannelSub } from './licencing/channels/LoadLicensingChannelSub'
import { SetLicenseKeyChannelSub } from './licencing/channels/SetLicenseKeyChannelSub'
import { OpenStorePageSub } from './licencing/channels/OpenStorePageSub'
import { UrlEncoderChannelSub } from './urlEncoder/channels/UrlEncoderChannelSub'
import { StringSorterChannelSub } from './stringSorter/channels/StringSorterChannelSub'
import { StringCaseChannelSub } from './stringCase/channels/StringCaseChannelSub'

export const ChannelConfigurationSubs: ChannelConfigurationTypeSub = {
  rtmSendChannels: [
    //appSupport
    new OpenFileLocationSub(),
    new OpenSubmitFeedbackSub(),
    new OpenStorePageSub(),
  ],
  rtmInvokeChannels: [
    //userSettings
    new LoadUserSettingsChannelSub(),
    new SaveUserSettingsChannelSub(),
    new ResetUserSettingsChannelSub(),
    //appSettings
    new LoadAppSettingsChannelSub(),
    new SetFirstAppUsageDateSub(),
    // licencing
    new LoadLicensingChannelSub(),
    new SetLicenseKeyChannelSub(),

    // features
    new GitConfigFilesListSub(),
    new RescanGitConfigsChannelSub(),
    new SshUrlConverterChannelSub(),
    new DecodeJwtChannelSub(),
    new EscapeJsonChannelSub(),
    new Base64EncoderChannelSub(),
    new UnixTimeConverterChannelSub(),
    new UrlEncoderChannelSub(),
    new StringSorterChannelSub(),
    new StringCaseChannelSub(),
  ],
}
