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
import { UsernameWarningMapper } from './UsernameWarningMapper'
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
      created: new Date(),
      searchedPath: settings.projectsPath,
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
    console.debug('Found git config file paths', gitConfigFilePaths)

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

    response.warningsList =
      await UsernameWarningMapper.mapWarningMessagesForCommitNames(
        parsedIniFiles
      )
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
