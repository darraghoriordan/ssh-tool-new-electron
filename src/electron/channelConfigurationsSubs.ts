import { LoadSettingsChannelSub } from './appSettings/channels/LoadSettingsChannelSub'
import { OpenFileLocationSub } from './appSettings/channels/OpenFileLocationSub'
import { ResetSettingsChannelSub } from './appSettings/channels/ResetSettingsChannelSub'
import { SaveSettingsChannelSub } from './appSettings/channels/SaveSettingsChannelSub'
import { GitConfigFilesListSub } from './gitConfigurations/channels/GitConfigFilesListSub'
import { RescanGitConfigsChannelSub } from './gitConfigurations/channels/RescanGitConfigsChannelSub'
import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'
import { EscapeJsonChannelSub } from './jsonEncoder/channels/EscapeJsonChannelSub'
import { DecodeJwtChannelSub } from './jwtDecoder/channels/DecodeJwtChannelSub'
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
  rtmSendChannels: [new SimpleMessageSub(), new OpenFileLocationSub()],
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
    new ResetSettingsChannelSub(),
    new RescanGitConfigsChannelSub(),
    new DecodeJwtChannelSub(),
    new EscapeJsonChannelSub(),
  ],
}
