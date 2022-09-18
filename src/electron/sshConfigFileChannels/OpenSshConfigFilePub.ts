/* eslint-disable @typescript-eslint/no-unused-vars */
import { SshConfigFileChannels } from './ConfigFileChannelEnum'
import { OpenFileResponseMessage } from './MessageTypes'
import { InvokeChannelBasePub } from '../IpcChannelTypes/InvokeChannelBasePub'

export class OpenSshConfigFilePub extends InvokeChannelBasePub {
  constructor() {
    super('OpenSshFile', SshConfigFileChannels.OPEN_CONFIG_FILE)
  }
}
