import { api } from '../../electron/bridge'
import { OpenFileResponseMessage } from '../../electron/sshConfigFileChannels/MessageTypes'
import {
  AddCertMessage,
  AddCertResponse,
  RemoveCertMessage,
  RemoveCertResponse,
  ScanForSshCertsMessage,
} from '../../electron/sshCertChannels/MessageTypes'
import { ScanForSshCertsResponse } from '../../electron/services/sshCertificates/Types'
import {
  SaveSettingsMessage,
  SettingsResponse,
} from '../../electron/appSettings/channels/MessageTypes'
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

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
    OpenSshFile: {
      invoke: () => Promise<OpenFileResponseMessage>
    }
    ScanForSshCerts: {
      invoke: (
        message: ScanForSshCertsMessage
      ) => Promise<ScanForSshCertsResponse>
    }
    GitConfigFilesList: {
      invoke: (message: GitConfigListRequest) => Promise<GitConfigListResponse>
    }
    SimpleMessage: { invoke: (message: string) => void }
    OpenFileLocation: { invoke: (filePath: string) => void }
    AddCertToSshAgent: {
      invoke: (message: AddCertMessage) => Promise<AddCertResponse>
    }
    RemoveCertFromSshAgent: {
      invoke: (message: RemoveCertMessage) => Promise<RemoveCertResponse>
    }
    LoadSettings: { invoke: () => Promise<SettingsResponse> }
    SaveSettings: {
      invoke: (message: SaveSettingsMessage) => Promise<SettingsResponse>
    }
    ResetSettings: {
      invoke: () => Promise<SettingsResponse>
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
  }
}
