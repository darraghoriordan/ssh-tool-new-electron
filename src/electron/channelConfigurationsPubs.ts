import { LoadSettingsChannelPub } from './appSettings/LoadSettingsChannelPub'
import { SaveSettingsChannelPub } from './appSettings/SaveSettingsChannelPub'
import { ScanGitConfigFilesPub } from './gitConfigurationFileChannels/ScanGitConfigFilesPub'
import { IIpcMainInvokeEventPub } from './IpcChannelTypes/IIpcMainInvokeEventPub'
import { IIpcMainSendEventPub } from './IpcChannelTypes/IIpcMainSendEventPub'
import { SimpleMessagePub } from './simpleMessage/SimpleMessagePub'
import { AddCertToSshAgentPub } from './sshCertChannels/AddCertToSshAgentPub'
import { GenerateCertPub } from './sshCertChannels/GenerateCertPub'
import { RemoveCertFromSshAgentPub } from './sshCertChannels/RemoveCertFromSshAgentPub'
import { ScanForSshCertsPub } from './sshCertChannels/ScanForSshCertsPub'
import { GetValidSshHostsPub } from './sshConfigFileChannels/GetValidSshHostsPub'
import { OpenSshConfigFilePub } from './sshConfigFileChannels/OpenSshConfigFilePub'

export type ChannelConfigurationTypePub = {
  rtmSendChannels: IIpcMainSendEventPub<unknown>[]
  rtmInvokeChannels: IIpcMainInvokeEventPub<unknown, unknown>[]
}

export const ChannelConfigurationPubs: ChannelConfigurationTypePub = {
  rtmSendChannels: [new SimpleMessagePub()],
  rtmInvokeChannels: [
    new OpenSshConfigFilePub(),
    new ScanForSshCertsPub(),
    new AddCertToSshAgentPub(),
    new GenerateCertPub(),
    new RemoveCertFromSshAgentPub(),
    new ScanGitConfigFilesPub(),
    new GetValidSshHostsPub(),
    new LoadSettingsChannelPub(),
    new SaveSettingsChannelPub(),
  ],
}
