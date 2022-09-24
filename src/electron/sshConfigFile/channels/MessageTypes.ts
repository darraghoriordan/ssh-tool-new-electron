import { SshConverterResults } from '../models/SshConverterResults'

export type SshUrlConverterChannelMessage = {
  gitUrl: string
}
export type SshUrlConverterChannelResponse = {
  possibleGitUrls: SshConverterResults
}
