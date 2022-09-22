import fs from 'fs'
import fsp from 'fs/promises'
import { spawnPromise } from '../../services/PromisifiedNodeUtilities/SpawnPromise'
import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'
import { GitConfigInfo } from '../../services/gitConfigSystemScanner/models/GitConfigInfo'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'

/**
 * Used when the cache is empty or missing
 * Will rescan the file system for git config files and
 * process them into our required model
 */
export default class GitConfigFileSystemScanner {
  static async scan(scanStartPath: string): Promise<GitConfigsModel> {
    const settings = await ApplicationSettingService.getSettings()

    const response: GitConfigsModel = {
      configList: [],
      searchedPath: settings.projectsPath,
      globalUser: undefined,
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

    // create readfile promises for each file to get the contents
    const fileReadPromises = gitConfigFilePaths.map(fInfo => {
      return fsp.readFile(fInfo)
    })

    // run all the promises to read file input
    const results = await Promise.allSettled(fileReadPromises)

    // parse the user from the global config file as a special case
    if (results[0].status === 'fulfilled') {
      response.globalUser = GitProjectConfigFileParser.parseGitUser(
        results[0].value.toString()
      )
    }

    // parse all the project files skipping the first because it's
    // the global config, also add that offset to the file paths
    // in the response
    const GLOBAL_CONFIG_OFFSET = 1
    const parsedIniFilePromises = results
      .slice(GLOBAL_CONFIG_OFFSET) // skip the first one (global config)
      .filter(r => r.status === 'fulfilled')
      .map((r, i) => {
        return GitProjectConfigFileParser.parseGitProjectConfig(
          (r as PromiseFulfilledResult<Buffer>).value.toString(),
          gitConfigFilePaths[i + GLOBAL_CONFIG_OFFSET]
        )
      })
    const settledIniParsePromises = await Promise.allSettled(
      parsedIniFilePromises
    )
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
    let stdout = ''
    // scan the file system for a list of files
    await GitConfigFileSystemScanner.scanFileSystem(stdout, scanStartPath)
    const mappedPaths = stdout
      .split(/\r?\n/)
      .filter((x: string | undefined) => x && x.trim() !== '')

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
  private static async scanFileSystem(stdout: string, scanStartPath: string) {
    stdout = await spawnPromise(
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
