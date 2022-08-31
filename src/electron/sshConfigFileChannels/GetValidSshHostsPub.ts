import { SshConfigFileChannels } from './ConfigFileChannelEnum'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class GetValidSshHostsPub extends InvokeChannelBasePub<void, string> {
  constructor() {
    super('GetValidSshHosts', SshConfigFileChannels.GET_VALID_SSH_HOSTS)
  }
}
