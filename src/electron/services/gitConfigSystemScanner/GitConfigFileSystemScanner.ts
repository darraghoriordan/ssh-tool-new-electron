import fs from 'fs'
import { GitConfigPathToFilePathMapper } from './GitConfigFileFindOutputParser'
import fsp from 'fs/promises'
import path from 'path'
import { spawnPromise } from '../PromisifiedNodeUtilities/SpawnPromise'
import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'
import { GitConfigInfo } from './models/GitConfigInfo'
import { GitConfigFileSystemScannerResponse } from './models/GitConfigFileSystemScannerResponse'

export default class GitConfigFileSystemScanner {
  static async scan(
    scanStartPath: string,
    homeDirectory: string
  ): Promise<GitConfigFileSystemScannerResponse> {
    const response: GitConfigFileSystemScannerResponse = {
      foundDirectory: true,
      isInError: false,
      contents: [],
      globalUser: undefined,
      allCustomUsers: [],
    }
    // check project path exists
    if (!fs.existsSync(scanStartPath)) {
      console.error('path not found', scanStartPath)
      response.foundDirectory = false
      response.errorMessage = 'home path not found'
      response.isInError = true
    }
    // scan the project path for matching config files
    if (response.foundDirectory) {
      let stdout = ''
      try {
        stdout = await spawnPromise(
          'find',
          [
            '.',
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
      } catch (error) {
        console.error(error)
        response.errorMessage = 'Failed to read git directories'
        response.isInError = true
        return response
      }
      // map the lines to a list of full paths and include global file
      const GLOBAL_CONFIG_FILE_PATH = path.join(homeDirectory, '.gitconfig')
      const gitConfigFilePaths = [GLOBAL_CONFIG_FILE_PATH].concat(
        GitConfigPathToFilePathMapper.map(homeDirectory, stdout)
      )

      // create promises for each file to get contents
      const fileReadPromises = gitConfigFilePaths.map(fInfo => {
        return fsp.readFile(fInfo)
      })

      // run all the promises
      const results = await Promise.allSettled(fileReadPromises)

      // parse the result of the global config file as a special case
      if (results[0].status === 'fulfilled') {
        response.globalUser = GitProjectConfigFileParser.parseGitUser(
          results[0].value.toString()
        )
      }

      // parse all the project files skipping the first because it's
      // the global config, also add that offset to the file paths
      // in the response
      const GLOBAL_CONFIG_OFFSET = 1
      const parsedIniFiles = results
        .slice(GLOBAL_CONFIG_OFFSET) // skip the first one (global config)
        .map((r, i) => {
          if (r.status === 'fulfilled') {
            return GitProjectConfigFileParser.parseGitProjectConfig(
              r.value.toString(),
              gitConfigFilePaths[i + GLOBAL_CONFIG_OFFSET]
            )
          }

          return undefined
        })
        .filter(x => x !== undefined) as GitConfigInfo[] // remove any failed ones

      // users are a global git thing
      response.allCustomUsers = parsedIniFiles
        .filter(gitConfig => gitConfig.user?.email || gitConfig.user?.name)
        .map(gitConfig => gitConfig.user)
        .filter((value, index, self) => {
          return (
            self.findIndex(
              v => v.email === value.email && v.name === value.name
            ) === index
          )
        })

      response.contents = parsedIniFiles
    }

    return response
  }
}
