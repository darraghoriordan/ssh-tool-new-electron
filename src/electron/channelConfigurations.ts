import { LoadSettingsChannel } from './appSettings/LoadSettingsChannel'
import { SaveSettingsChannel } from './appSettings/SaveSettingsChannel'
import { ScanGitConfigFiles } from './gitConfigurationFileChannels/ScanGitConfigFiles'
import { IpcMainInvokeEventChannelInterface } from './IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { IpcMainSendEventChannelInterface } from './IpcChannelTypes/IpcMainSendEventChannelInterface'
import { SimpleMessage } from './simpleMessage/SimpleMessage'
import { AddCertToSshAgent } from './sshCertChannels/AddCertToSshAgent'
import { GenerateCert } from './sshCertChannels/GenerateCert'
import { RemoveCertFromSshAgent } from './sshCertChannels/RemoveCertFromSshAgent'
import { ScanForSshCerts } from './sshCertChannels/ScanForSshCerts'
import { GetValidSshHosts } from './sshConfigFileChannels/GetValidSshHosts'
import { OpenSshConfigFile } from './sshConfigFileChannels/OpenSshConfigFile'

export type ChannelConfigurationType = {
  rtmSendChannels: IpcMainSendEventChannelInterface<any>[]
  rtmInvokeChannels: IpcMainInvokeEventChannelInterface<any, any>[]
}

export const ChannelConfigurations: ChannelConfigurationType = {
  rtmSendChannels: [new SimpleMessage()],
  rtmInvokeChannels: [
    new OpenSshConfigFile(),
    new ScanForSshCerts(),
    new AddCertToSshAgent(),
    new GenerateCert(),
    new RemoveCertFromSshAgent(),
    new ScanGitConfigFiles(),
    new GetValidSshHosts(),
    new LoadSettingsChannel(),
    new SaveSettingsChannel(),
  ],
}
