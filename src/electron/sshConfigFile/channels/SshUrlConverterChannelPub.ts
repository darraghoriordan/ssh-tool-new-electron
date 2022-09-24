import { SshConfigFileChannels } from './ConfigFileChannelEnum'
import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'

export class SshUrlConverterChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('SshUrlConverter', SshConfigFileChannels.CONVERT_SSH_URL)
  }
}
