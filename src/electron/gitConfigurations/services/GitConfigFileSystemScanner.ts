import fs from 'fs'
import fsp from 'fs/promises'
import { spawnPromise } from '../../services/PromisifiedNodeUtilities/SpawnPromise'
import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'
import { GitConfigInfo } from '../models/GitConfigInfo'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import path from 'path'
import { GitUser } from '../models/GitUser'

/**
 * Used when the cache is empty or missing
 * Will rescan the file system for git config files and
 * process them into our required model
 */
export default class GitConfigFileSystemScanner {
  static async scan(scanStartPath: string): Promise<GitConfigsModel> {
    const settings = await ApplicationSettingService.getSettings()
    console.log('starting scan')
    const response: GitConfigsModel = {
      configList: [],
      searchedPath: settings.projectsPath,
      // globalUser: undefined,
    }
    // check project path exists
    if (!fs.existsSync(scanStartPath)) {
      throw new Error(
        `Git Config file project directory not found (${scanStartPath})`
      )
    }

    // recursive scan of the project path for paths to Git config files
    const gitConfigFilePaths =
      await GitConfigFileSystemScanner.getListOfPathsToGitConfigFiles(
        scanStartPath,
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

    response.configList = parsedIniFiles

    return response
  }

  static async getListOfPathsToGitConfigFiles(
    scanStartPath: string,
    globalGitConfigFilePath: string
  ) {
    // eslint-disable-next-line prefer-const

    // scan the file system for a list of files
    const stdout = await this.scanFileSystem(scanStartPath)
    console.log('stdout', stdout)
    const mappedPaths = stdout
      .split(/\r?\n/)
      .filter((x: string | undefined) => x && x.trim() !== '')
      .map(x => path.join(x, 'config'))

    // add the git global config file to the array
    const gitConfigFilePaths = [globalGitConfigFilePath].concat(mappedPaths)

    return gitConfigFilePaths
  }

  /**
   * output looks like
   * /Users/darraghoriordan/Documents/personal-projects/ssh-tool-new-electron/.git
   * /Users/darraghoriordan/Documents/personal-projects/mac-setup-script/.git
   * /Users/darraghoriordan/Documents/personal-projects/remix-project/.git
   * @param stdout
   * @param scanStartPath
   * @returns
   */
  private static async scanFileSystem(scanStartPath: string) {
    const stdout = await spawnPromise(
      'find',
      [
        `${scanStartPath}`,
        '-type',
        'd',
        '(',
        '-path',
        './Library',
        '-o',
        '-path',
        './.Trash',
        '-o',
        '-path',
        './.config',
        '-o',
        '-path',
        './.nuget',
        '-o',
        '-path',
        './.vscode',
        '-o',
        '-path',
        './.npm',
        '-o',
        '-path',
        './development/flutter',
        '-o',
        '-path',
        './Virtual Machines.localized',
        '-o',
        '-path',
        './Applications',
        '-o',
        '-path',
        './Movies',
        '-o',
        '-path',
        './Music',
        '-o',
        '-path',
        './Pictures',
        '-o',
        '-path',
        './Public',
        '-o',
        '-path',
        './.antigen',
        '-o',
        '-name',
        'node_modules',
        ')',
        '-prune',
        '-o',
        '-name',
        '.git',
        '-print',
      ],
      scanStartPath
    )
    return stdout
  }
}
