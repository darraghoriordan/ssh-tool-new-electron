import { api } from '../../electron/bridge'
import { OpenFileResponseMessage } from '../../electron/sshConfigFileChannels/MessageTypes'
import {
  AddCertMessage,
  AddCertResponse,
  RemoveCertMessage,
  RemoveCertResponse,
  ScanForSshCertsMessage,
} from '../../electron/sshCertChannels/MessageTypes'
import {
  GitConfigFileScanRequestMessage,
  GitConfigScanResponseMessage,
} from '../../electron/gitConfigurations/channels/MessageTypes'
import { ScanForSshCertsResponse } from '../../electron/services/sshCertificates/Types'
import {
  SaveSettingsMessage,
  SettingsResponse,
} from '../../electron/appSettings/channels/MessageTypes'

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
      invoke: () => Promise<GitConfigScanResponseMessage>
    }
    SimpleMessage: { invoke: (message: string) => void }
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
  }
}
