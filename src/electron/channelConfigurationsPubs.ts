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
import { OpenStorePagePub } from './licencing/channels/OpenStorePagePub'
import { UrlEncoderChannelPub } from './urlEncoder/channels/UrlEncoderChannelPub'
import { StringCaseChannelPub } from './stringCase/channels/StringCaseChannelPub'
import { StringSorterChannelPub } from './stringSorter/channels/StringSorterChannelPub'
import { EslintRuleHelperChannelPub } from './eslintRuleHelper/channels/EslintRuleGeneratorChannelPub'
import { GetPastGenerationChannelPub } from './eslintRuleHelper/channels/GetPastGenerationChannelPub'
import { ListPastGenerationsChannelPub } from './eslintRuleHelper/channels/ListPastGenerationsChannelPub'

export const ChannelConfigurationPubs: ChannelConfigurationTypePub = {
  rtmSendChannels: [
    // appSupport
    new OpenFileLocationPub(),
    new OpenSubmitFeedbackPub(),
    new OpenStorePagePub(),
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
    new StringCaseChannelPub(),
    new StringSorterChannelPub(),
    new UrlEncoderChannelPub(),
    new EslintRuleHelperChannelPub(),
    new ListPastGenerationsChannelPub(),
    new GetPastGenerationChannelPub(),
  ],
}
