import { LoadSettingsChannelSub } from './appSettings/channels/LoadSettingsChannelSub'
import { SaveSettingsChannelSub } from './appSettings/channels/SaveSettingsChannelSub'
import { GitConfigFilesListSub } from './gitConfigurations/channels/GitConfigFilesListSub'
import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'
import { SimpleMessageSub } from './simpleMessage/SimpleMessageSub'
import { AddCertToSshAgentSub } from './sshCertChannels/AddCertToSshAgentSub'
import { GenerateCertSub } from './sshCertChannels/GenerateCertSub'
import { RemoveCertFromSshAgentSub } from './sshCertChannels/RemoveCertFromSshAgentSub'
import { ScanForSshCertsSub } from './sshCertChannels/ScanForSshCertsSub'
import { GetValidSshHostsSub } from './sshConfigFileChannels/GetValidSshHostsSub'
import { OpenSshConfigFileSub } from './sshConfigFileChannels/OpenSshConfigFileSub'

export type ChannelConfigurationTypeSub = {
  rtmSendChannels: IIpcMainSendEventSub<unknown>[]
  rtmInvokeChannels: IIpcMainInvokeEventSub<unknown, unknown>[]
}

export const ChannelConfigurationSubs: ChannelConfigurationTypeSub = {
  rtmSendChannels: [new SimpleMessageSub()],
  rtmInvokeChannels: [
    new OpenSshConfigFileSub(),
    new ScanForSshCertsSub(),
    new AddCertToSshAgentSub(),
    new GenerateCertSub(),
    new RemoveCertFromSshAgentSub(),
    new GitConfigFilesListSub(),
    new GetValidSshHostsSub(),
    new LoadSettingsChannelSub(),
    new SaveSettingsChannelSub(),
  ],
}
