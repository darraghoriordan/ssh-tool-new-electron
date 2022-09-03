import { LoadSettingsChannelPub } from './appSettings/LoadSettingsChannelPub'
import { SaveSettingsChannelPub } from './appSettings/SaveSettingsChannelPub'
import { ScanGitConfigFilesPub } from './gitConfigurationFileChannels/ScanGitConfigFilesPub'
import { AddCertToSshAgentPub } from './sshCertChannels/AddCertToSshAgentPub'
import { GenerateCertPub } from './sshCertChannels/GenerateCertPub'
import { RemoveCertFromSshAgentPub } from './sshCertChannels/RemoveCertFromSshAgentPub'
import { ScanForSshCertsPub } from './sshCertChannels/ScanForSshCertsPub'
import { GetValidSshHostsPub } from './sshConfigFileChannels/GetValidSshHostsPub'
import { SimpleMessagePub } from './simpleMessage/SimpleMessagePub'

import { OpenSshConfigFilePub } from './sshConfigFileChannels/OpenSshConfigFilePub'
import { ChannelConfigurationTypePub } from './ChannelConfigurationTypePub'

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
