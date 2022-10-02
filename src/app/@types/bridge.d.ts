import { api } from '../../electron/bridge'
import {
  SshUrlConverterChannelMessage,
  SshUrlConverterChannelResponse,
} from '../../electron/sshConfigFile/channels/MessageTypes'

import {
  SaveUserSettingsMessage,
  UserSettingsResponse,
} from '../../electron/userSettings/channels/MessageTypes'
import {
  GitConfigListRequest,
  GitConfigListResponse,
} from '../../electron/gitConfigurations/channels/MessageTypes'
import {
  DecodeJwtMessage,
  DecodeJwtResponse,
} from '../../electron/jwtDecoder/channels/MessageTypes'
import {
  EscapeJsonMessage,
  EscapeJsonResponse,
} from '../../electron/jsonEncoder/channels/MessageTypes'
import {
  Base64EncoderMessage,
  Base64EncoderResponse,
} from '../../electron/base64Encoder/channels/MessageTypes'
import {
  UnixTimeConverterMessage,
  UnixTimeConverterResponse,
} from '../../electron/unixTimeConverter/channels/MessageTypes'
import { AppSettingsResponse } from '../../electron/appSettings/channels/MessageTypes'
import { LicenseDataDto } from '../../electron/licencing/models/LicenseDataDto'
import { SetLicenseKeyRequest } from '../../electron/licencing/channels/SetLicenseKeyChannelSub'

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
    GitConfigFilesList: {
      invoke: (message: GitConfigListRequest) => Promise<GitConfigListResponse>
    }
    SimpleMessage: { invoke: (message: string) => void }
    OpenFileLocation: { invoke: (filePath: string) => void }

    LoadUserSettings: { invoke: () => Promise<UserSettingsResponse> }
    SaveUserSettings: {
      invoke: (
        message: SaveUserSettingsMessage
      ) => Promise<UserSettingsResponse>
    }
    ResetUserSettings: {
      invoke: () => Promise<UserSettingsResponse>
    }
    RescanGithubConfigs: {
      invoke: () => Promise<void>
    }
    DecodeJwt: {
      invoke: (message: DecodeJwtMessage) => Promise<DecodeJwtResponse>
    }
    EscapeJson: {
      invoke: (message: EscapeJsonMessage) => Promise<EscapeJsonResponse>
    }
    Base64Encoder: {
      invoke: (message: Base64EncoderMessage) => Promise<Base64EncoderResponse>
    }
    UnixTimeConverter: {
      invoke: (
        message: UnixTimeConverterMessage
      ) => Promise<UnixTimeConverterResponse>
    }
    SshUrlConverter: {
      invoke: (
        message: SshUrlConverterChannelMessage
      ) => Promise<SshUrlConverterChannelResponse>
    }
    OpenSubmitFeedback: { invoke: () => void }
    LoadAppSettings: { invoke: () => Promise<AppSettingsResponse> }
    SetFirstAppUsageDate: { invoke: () => Promise<void> }
    LoadLicensing: { invoke: () => Promise<LicenseDataDto> }
    SetLicenseKey: {
      invoke: (message: SetLicenseKeyRequest) => Promise<LicenseDataDto>
    }
  }
}
