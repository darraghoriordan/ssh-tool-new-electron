import { LoadSettingsChannelPub } from './appSettings/channels/LoadSettingsChannelPub'
import { SaveSettingsChannelPub } from './appSettings/channels/SaveSettingsChannelPub'
import { AddCertToSshAgentPub } from './sshCertChannels/AddCertToSshAgentPub'
import { GenerateCertPub } from './sshCertChannels/GenerateCertPub'
import { RemoveCertFromSshAgentPub } from './sshCertChannels/RemoveCertFromSshAgentPub'
import { ScanForSshCertsPub } from './sshCertChannels/ScanForSshCertsPub'
import { GetValidSshHostsPub } from './sshConfigFileChannels/GetValidSshHostsPub'
import { SimpleMessagePub } from './simpleMessage/SimpleMessagePub'
import { OpenSshConfigFilePub } from './sshConfigFileChannels/OpenSshConfigFilePub'
import { ChannelConfigurationTypePub } from './ChannelConfigurationTypePub'
import { GitConfigFilesListPub } from './gitConfigurations/channels/GitConfigFilesListPub'

export const ChannelConfigurationPubs: ChannelConfigurationTypePub = {
  rtmSendChannels: [new SimpleMessagePub()],
  rtmInvokeChannels: [
    new OpenSshConfigFilePub(),
    new ScanForSshCertsPub(),
    new AddCertToSshAgentPub(),
    new GenerateCertPub(),
    new RemoveCertFromSshAgentPub(),
    new GitConfigFilesListPub(),
    new GetValidSshHostsPub(),
    new LoadSettingsChannelPub(),
    new SaveSettingsChannelPub(),
  ],
}
