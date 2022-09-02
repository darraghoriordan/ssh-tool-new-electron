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
} from '../../electron/gitConfigurationFileChannels/MessageTypes'
import { ScanForSshCertsResponse } from '../../electron/services/sshCertificates/Types'
import {
  SaveSettingsMessage,
  SettingsResponse,
} from '../../electron/appSettings/MessageTypes'

declare global {
  // eslint-disable-next-line
  interface Window {
    Main: typeof api
    OpenSshFile: IIpcMainInvokeEventPub<void, OpenFileResponseMessage>
    ScanForSshCerts: IIpcMainInvokeEventPub<
      ScanForSshCertsMessage,
      ScanForSshCertsResponse
    >
    ScanGitConfigFiles: IIpcMainInvokeEventPub<
      GitConfigFileScanRequestMessage,
      GitConfigScanResponseMessage
    >
    SimpleMessage: IIpcMainSendEventPub<string>
    AddCertToSshAgent: IIpcMainInvokeEventPub<AddCertMessage, AddCertResponse>
    RemoveCertFromSshAgent: IIpcMainInvokeEventPub<
      RemoveCertMessage,
      RemoveCertResponse
    >
    LoadSettings: IIpcMainInvokeEventPub<void, SettingsResponse>
    SaveSettings: IIpcMainInvokeEventPub<SaveSettingsMessage, SettingsResponse>
  }
}
