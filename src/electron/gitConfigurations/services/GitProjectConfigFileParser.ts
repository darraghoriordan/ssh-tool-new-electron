import { GitUser } from '../models/GitUser'
import { GitRemote } from '../models/GitRemote'
import { GitConfigInfo } from '../models/GitConfigInfo'
import { GitProtocolTypeEnum } from '../models/GitProtocolTypeEnum'
import ini from 'ini'
import gitUrlParser from 'git-url-parse'
import { GitConfigFileEditor } from './GitConfigFileEditor'

export class GitProjectConfigFileParser {
  static parseGitUser(rawFile: string): GitUser | undefined {
    const parsedIni = ini.parse(rawFile)
    return this.parseGitUserFromIni(parsedIni)
  }

  static parseGitUserFromIni(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parsedIniFile: { [key: string]: any }
  ): GitUser | undefined {
    if (!parsedIniFile.user) {
      return undefined
    }

    return {
      name: parsedIniFile.user?.name,
      email: parsedIniFile.user?.email,
    }
  }

  static async parseGitProjectConfig(
    rawFile: string,
    filePath: string,
    globalGitUser: GitUser | undefined
  ): Promise<GitConfigInfo> {
    const parsedIniFile = ini.parse(rawFile)

    const remotesKeys = GitProjectConfigFileParser.filterIniKeys(
      parsedIniFile,
      /^remote /
    )
    const user = this.parseGitUserFromIni(parsedIniFile)
    const result: GitConfigInfo = {
      path: filePath,
      potentialOrigins: [],
      id: Buffer.from(filePath).toString('base64'),
      remotes: remotesKeys.map(remoteKey =>
        this.mapSingleRemote(remoteKey, parsedIniFile[remoteKey].url)
      ),
      isProjectUserSet: user !== undefined,
      user: user || globalGitUser,
      userAsIniString: GitConfigFileEditor.convertToIniFormat(
        user || globalGitUser
      ),
    }

    result.originRepositoryFileName = this.extractOriginGitRepoName(result)

    return result
  }
  static mapSingleRemote(remoteNameKey: string, url: string): GitRemote {
    const parsedUrl = gitUrlParser(url)

    const remote = new GitRemote()

    remote.type = this.mapUrlType(parsedUrl.protocol)
    remote.remoteName = this.cleanRemoteName(remoteNameKey)
    remote.url = url
    remote.owner = parsedUrl.owner
    remote.pathname = parsedUrl.pathname
    remote.protocol = parsedUrl.protocol
    remote.source = parsedUrl.source
    remote.port = parsedUrl.port || undefined
    remote.user = parsedUrl.user
    remote.repoName = parsedUrl.name

    return remote
  }

  static cleanRemoteName(rawRemote: string): string {
    return (
      rawRemote
        // eslint-disable-next-line no-useless-escape
        .replace(/remote "/, '')
        .trim()
        // eslint-disable-next-line no-useless-escape
        .replace(/"/, '')
    )
  }
  // NOT USED - but could be useful in the future - WILL USE MANUAL METHOD FOR NOW
  //   static findPotentialRemoteOrigins(
  //     gitConfigInfo: GitConfigInfo,
  //     listOfNamedSshConnections: AvailableHost[]
  //   ): GitRemote[] {
  //     // grab the single origin
  //     console.info(
  //       `Mapping ${listOfNamedSshConnections.length} named connections`
  //     )
  //     const originRemote = gitConfigInfo.remotes.find(x =>
  //       x.remoteName.includes('origin')
  //     )
  //     // we can't change the origin if there isnt one already set
  //     // but then maybe the customer will want to set one using the app?
  //     // edit, no because you cant set origin with knowing base url, unless
  //     // we offer a list of all potential ssh connections
  //     if (!originRemote) {
  //       return []
  //     }

  //     // for each config create ssh connections for each ssh certificate
  //     // if ssh then for each connection add a potential http connection
  //     // if ssh remove the existing named connection if in use
  //     // if http then remove the potential http connection
  //     // this needs a git remote connection
  //     const mappedSshHostsToGitRemotes = listOfNamedSshConnections.map(x => {
  //       return {
  //         url: `${x.user}@${x.alias}:${originRemote.pathname.substring(1)}`, // this will have to change based on the contents of this object
  //         owner: originRemote.owner,
  //         pathname: originRemote.pathname,
  //         protocol: 'ssh',
  //         source: originRemote.source, // unsure if this changes? might like the root url? need docs
  //         port: undefined,
  //         user: x.user,
  //         repoName: originRemote.repoName,
  //         remoteName: originRemote.remoteName,
  //         type: GitProtocolTypeEnum.SSH,
  //       } as GitRemote
  //     })

  //     return mappedSshHostsToGitRemotes
  //   }

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

  static mapUrlType(protocol: string): GitProtocolTypeEnum {
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
  static filterIniKeys = (obj: Object, filter: RegExp) => {
    const keys = []
    for (const key in obj)
      if (Object.prototype.hasOwnProperty.call(obj, key) && filter.test(key)) {
        keys.push(key)
      }
    return keys
  }
}
