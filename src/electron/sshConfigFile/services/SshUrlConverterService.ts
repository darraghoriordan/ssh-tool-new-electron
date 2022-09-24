import gitUrlParser from 'git-url-parse'
import { SshConverterResults } from '../models/SshConverterResults'
import { SshConfigFileLoader } from './SshConfigFileLoader'

export class SshUrlConverterService {
  public static async getPossibleSshUrls(
    inputUrl: string
  ): Promise<SshConverterResults> {
    const results = new SshConverterResults('', '', [])
    // parse inputUrl with git-url-parse and get the host
    const parsedInputUrl = gitUrlParser(inputUrl)

    if (
      parsedInputUrl.protocol === 'https' ||
      parsedInputUrl.protocol === 'http'
    ) {
      results.sshUrl = `git@${parsedInputUrl.resource}:${parsedInputUrl.full_name}.git`
      results.httpUrl = inputUrl
    }

    if (parsedInputUrl.protocol === 'ssh') {
      results.httpUrl = `https://${parsedInputUrl.resource}/${parsedInputUrl.full_name}.git`
      results.sshUrl = inputUrl
    }

    // because we can't match wildcards in the host (too lazy)
    // we need to get all the hosts from the ssh config file
    // so there might be duplicates

    const parsedSshHosts = await SshConfigFileLoader.load()

    parsedSshHosts.forEach(host => {
      results.sshAliases.push({
        url: `git@${host.alias}:${parsedInputUrl.full_name}.git`,
        alias: host.alias,
      })
    })

    return results
  }
}
