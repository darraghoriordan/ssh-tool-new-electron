import fs from 'fs'
import fsp from 'fs/promises'
import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'
import { GitConfigInfo } from '../models/GitConfigInfo'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import path from 'path'
import { GitUser } from '../models/GitUser'
import FileListResolverNix from './FileListResolverNix'
import FileListResolverWindows from './FileListResolverWindows'
import os from 'os'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
/**
 * Used when the cache is empty or missing
 * Will rescan the file system for git config files and
 * process them inFto our required model
 */
export default class GitConfigFileSystemScanner {
  static fileScannerInstances = [
    new FileListResolverNix(),
    new FileListResolverWindows(),
  ]

  static async scan(scanStartPath: string): Promise<GitConfigsModel> {
    const settings = await UserSettingsService.getSettings()
    console.log('starting scan')
    const response: GitConfigsModel = {
      configList: [],
      warningsList: [],
      searchedPath: settings.projectsPath,
      // globalUser: undefined,
    }
    // check project path exists
    if (!fs.existsSync(scanStartPath)) {
      throw new Error(
        `Git Config file project directory not found (${scanStartPath})`
      )
    }

    // nix uses find and windows uses dir
    const scannerInstance = this.fileScannerInstances.find(x =>
      x.platformMatchers.includes(os.platform())
    )

    if (!scannerInstance) {
      throw new Error(`No file scanner found for platform ${os.platform()}`)
    }

    const stdout = await scannerInstance.scanFileSystem(scanStartPath)
    // recursive scan of the project path for paths to Git config files
    const gitConfigFilePaths =
      await GitConfigFileSystemScanner.getListOfPathsToGitConfigFiles(
        stdout,
        settings.globalGitConfigFile
      )
    console.log('gitConfigFilePaths', gitConfigFilePaths)

    if (gitConfigFilePaths.length <= 0) {
      return response
    }
    // create readfile promises for every file to get the contents
    const fileReadPromises = gitConfigFilePaths.map(filePath => {
      return new Promise<{ fileContents: string; filePath: string }>(
        (resolve, reject) => {
          fsp
            .readFile(filePath, 'utf8')
            .then((fileContents: string) => {
              resolve({ fileContents, filePath })
            })
            .catch((err: Error) => {
              console.log('error reading file', err)
              reject(err)
            })
        }
      )
    })

    // run all the promises to read file input
    const results = await Promise.allSettled(fileReadPromises)

    // split out the global config from this array
    const [globalConfigResult, ...projectConfigResults] = results

    let globalUser: GitUser | undefined
    // parse the user from the global config file as a special case
    if (globalConfigResult.status === 'fulfilled') {
      globalUser = GitProjectConfigFileParser.parseGitUser(
        globalConfigResult.value.fileContents.toString()
      )
    }

    // parse all the project files
    const parsedIniFilePromises = projectConfigResults
      .filter(r => r.status === 'fulfilled')
      .map(r => {
        const fulfilledResult = r as PromiseFulfilledResult<{
          fileContents: string
          filePath: string
        }>
        return GitProjectConfigFileParser.parseGitProjectConfig(
          fulfilledResult.value.fileContents,
          fulfilledResult.value.filePath,
          globalUser
        )
      })

    const settledIniParsePromises = await Promise.allSettled(
      parsedIniFilePromises
    )

    // filter out the ones that failed
    const parsedIniFiles = settledIniParsePromises
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<GitConfigInfo>).value)

    // REMOVE# FOR NOW
    // now parse potential origins from the ssh connections
    // const namedSshConnections = await SshConfigFileLoader.load()
    // const iniFilesWithRemotes = parsedIniFiles.map(iniFile => {
    //   try {
    //     const possibleRemotes =
    //       GitProjectConfigFileParser.findPotentialRemoteOrigins(
    //         iniFile,
    //         namedSshConnections
    //       )
    //     iniFile.potentialOrigins = possibleRemotes
    //   } catch (error) {
    //     console.warn("Couldn't find a remote", iniFile.path)
    //   }
    // })

    // REMOVED FOR NOW
    // now parse all the individual custom users from each config
    //   response.allCustomUsers = parsedIniFiles
    //     .filter(gitConfig => gitConfig.user?.email || gitConfig.user?.name)
    //     .map(gitConfig => gitConfig.user)
    //     .filter((value, index, self) => {
    //       return (
    //         self.findIndex(
    //           v => v.email === value.email && v.name === value.name
    //         ) === index
    //       )
    //     })

    // generate warnings for any parsedIniFiles where the user does not match
    // this is inefficient but it's a small list so it's fine
    const warnings: { originPath: string; message: string }[] = []

    parsedIniFiles.forEach(iniFile => {
      const originPath = iniFile.remotes.find(r =>
        r.remoteName.includes('origin')
      )?.pathname
      console.log('originPath', originPath)
      console.log('iniFile.user?.email', iniFile.user?.email)
      console.log('r0 pathname', iniFile.remotes[0]?.pathname)
      console.log('r0 source', iniFile.remotes[0]?.source)
      console.log('r0 reponame', iniFile.remotes[0]?.repoName)
      if (!originPath) {
        // no origin found - can't do anything here
        return
      }

      if (warnings.some(w => w.originPath === originPath)) {
        return // already have a warning for this origin
      }

      // find the number of ini files where the remote path is the same but the user email is different
      const numberOfReposWithSameHostDifferentUser = parsedIniFiles.filter(
        f =>
          f.remotes.some(r => r.pathname === originPath) &&
          f.user?.email !== iniFile.user?.email
      ).length
      const numberOfReposWithSameHostSameUser = parsedIniFiles.filter(
        f =>
          f.remotes.some(r => r.pathname === originPath) &&
          f.user?.email !== iniFile.user?.email
      ).length

      if (
        numberOfReposWithSameHostDifferentUser >=
        numberOfReposWithSameHostSameUser
      ) {
        warnings.push({
          originPath,
          message: `There is a mismatch between the user set for ${iniFile.path} and the user set for other repositories with the same origin. Is this intentional?`,
        })
      }
    })
    response.warningsList = warnings.map(x => x.message)
    response.configList = parsedIniFiles

    return response
  }
  static async getListOfPathsToGitConfigFiles(
    stdout: string,
    globalGitConfigFilePath: string
  ) {
    // eslint-disable-next-line prefer-const
    const mappedPaths = stdout
      .split(/\r?\n/)
      .filter(x => x.includes('.git')) // remove any non config files (dir on windows prints "nothing found")
      .filter((x: string | undefined) => x && x.trim() !== '')
      .map(x => path.join(x, 'config'))

    // add the git global config file to the array
    const gitConfigFilePaths = [globalGitConfigFilePath].concat(mappedPaths)

    return gitConfigFilePaths
  }
}
