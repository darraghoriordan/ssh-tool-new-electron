import { IpcMainInvokeApi } from '../../electron/IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { IpcMainSendApi } from '../../electron/IpcChannelTypes/IpcMainSendEventChannelInterface'
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
    OpenSshFile: IpcMainInvokeApi<void, OpenFileResponseMessage>
    ScanForSshCerts: IpcMainInvokeApi<
      ScanForSshCertsMessage,
      ScanForSshCertsResponse
    >
    ScanGitConfigFiles: IpcMainInvokeApi<
      GitConfigFileScanRequestMessage,
      GitConfigScanResponseMessage
    >
    SimpleMessage: IpcMainSendApi<string>
    AddCertToSshAgent: IpcMainInvokeApi<AddCertMessage, AddCertResponse>
    RemoveCertFromSshAgent: IpcMainInvokeApi<
      RemoveCertMessage,
      RemoveCertResponse
    >
    LoadSettings: IpcMainInvokeApi<void, SettingsResponse>
    SaveSettings: IpcMainInvokeApi<SaveSettingsMessage, SettingsResponse>
  }
}
