import { GitUser } from './models/GitUser'
import { GitRemote } from './models/GitRemote'
import { GitConfigInfo } from './models/GitConfigInfo'
import { GitProtocolTypeEnum } from './models/GitProtocolTypeEnum'
import ini from 'ini'
import gitUrlParser from 'git-url-parse'
import { SshConfigFileLoader } from '../sshConfigFile/SshConfigFileLoader'
import { AvailableHost } from '../sshConfigFile/SshConfigFileParser'

export class GitProjectConfigFileParser {
  static parseGitGlobalConfig(rawFile: string): GitUser {
    const parsedGlobal = ini.parse(rawFile)
    return {
      name: parsedGlobal.user?.name,
      email: parsedGlobal.user?.email,
    }
  }

  static parseGitProjectConfig(
    rawFile: string,
    filePath: string
  ): GitConfigInfo {
    const iniParse = ini.parse(rawFile)
    const namedSshConnections = SshConfigFileLoader.load()

    console.log('parsed the ini file', iniParse)
    console.log('parsed ssh connections', namedSshConnections)
    const remotesKeys = GitProjectConfigFileParser.filteredKeys(
      iniParse,
      /^remote /
    )

    const result: GitConfigInfo = {
      path: filePath,
      potentialOrigins: [],
      remotes: remotesKeys.map(remoteNameKey => {
        const rawUrl = iniParse[remoteNameKey].url
        const parsedUrl = gitUrlParser(rawUrl)
        const urlType = this.parseUrlType(parsedUrl.protocol)
        const remoteName = remoteNameKey
          // eslint-disable-next-line no-useless-escape
          .replace(/remote "/, '')
          .trim()
          // eslint-disable-next-line no-useless-escape
          .replace(/"/, '')
        const remote = new GitRemote()

        remote.url = rawUrl
        remote.owner = parsedUrl.owner
        remote.pathname = parsedUrl.pathname
        remote.protocol = parsedUrl.protocol
        remote.source = parsedUrl.source
        remote.port = parsedUrl.port || undefined
        remote.user = parsedUrl.user
        remote.repoName = parsedUrl.name
        remote.remoteName = remoteName
        remote.type = urlType
        return remote
      }),
      user: { email: iniParse.user?.email, name: iniParse.user?.name },
    }
    result.originRepositoryFileName = this.extractOriginGitRepoName(result)
    try {
      const possibleRemotes = this.findPotentialRemoteOrigins(
        result,
        namedSshConnections
      )
      result.potentialOrigins = possibleRemotes
    } catch (error) {
      console.warn("Couldn't find a remote", result.path)
    }

    return result
  }

  static findPotentialRemoteOrigins(
    gitConfigInfo: GitConfigInfo,
    listOfNamedSshConnections: AvailableHost[]
  ): GitRemote[] {
    // grab the single origin
    console.info(
      `Mapping ${listOfNamedSshConnections.length} named connections`
    )
    const originRemote = gitConfigInfo.remotes.find(x =>
      x.remoteName.includes('origin')
    )
    // we can't change the origin if there isnt one already set
    // but then maybe the customer will want to set one using the app?
    // edit, no because you cant set origin with knowing base url, unless
    // we offer a list of all potential ssh connections
    if (!originRemote) {
      return []
    }

    // for each config create ssh connections for each ssh certificate
    // if ssh then for each connection add a potential http connection
    // if ssh remove the existing named connection if in use
    // if http then remove the potential http connection
    // this needs a git remote connection
    const mappedSshHostsToGitRemotes = listOfNamedSshConnections.map(x => {
      return {
        url: `${x.user}@${x.alias}:${originRemote.pathname.substring(1)}`, // this will have to change based on the contents of this object
        owner: originRemote.owner,
        pathname: originRemote.pathname,
        protocol: 'ssh',
        source: originRemote.source, // unsure if this changes? might like the root url? need docs
        port: undefined,
        user: x.user,
        repoName: originRemote.repoName,
        remoteName: originRemote.remoteName,
        type: GitProtocolTypeEnum.SSH,
      } as GitRemote
    })

    return mappedSshHostsToGitRemotes
  }

  static extractOriginGitRepoName(gitConfigInfo: GitConfigInfo): string {
    const unknownRepoTitle = 'Unknown Remote Origin'
    const originRemote = gitConfigInfo.remotes.find(x =>
      x.remoteName.includes('origin')
    )

    if (originRemote === undefined) {
      return unknownRepoTitle
    }
    return originRemote.repoName || unknownRepoTitle
  }

  static parseUrlType(protocol: string): GitProtocolTypeEnum {
    switch (protocol) {
      case 'ssh':
        return GitProtocolTypeEnum.SSH
      case 'http':
      case 'https':
        return GitProtocolTypeEnum.HTTP
      default:
        return GitProtocolTypeEnum.UNKNOWN
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static filteredKeys = (obj: Object, filter: RegExp) => {
    const keys = []
    for (const key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, key) && filter.test(key)) {
        keys.push(key)
      }
    return keys
  }
}
