import { SshConfigFileLine } from '../services/sshConfigFile/SshConfigFileLine'
import { AvailableHost } from '../services/sshConfigFile/SshConfigFileParser'

export type SaveFileMessage = { path: string; contents: string }
export type OpenFileResponseMessage = {
  path: string
  contents: SshConfigFileLine[] | undefined
  found: boolean
}
export type GetValidSshHostsResponseMessage = {
  path: string
  contents: AvailableHost[] | undefined
  found: boolean
}
