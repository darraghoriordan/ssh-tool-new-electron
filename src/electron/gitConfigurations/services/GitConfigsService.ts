import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import { GitConfigsFileCacheService } from './GitConfigsFileCacheService'
import GitConfigFileSystemScanner from './GitConfigFileSystemScanner'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'

export class GitConfigsService {
  static async loadGitConfigs(): Promise<GitConfigsModel> {
    const settings = await UserSettingsService.getSettings()

    // try to find data in filesystem cache first
    let cacheData = await GitConfigsFileCacheService.loadFromFile()

    // if cache is empty, rescan
    if (GitConfigsService.shouldRescan(cacheData)) {
      // scan the system for data
      console.log(
        `Scanning system (${settings.projectsPath}) for git config files...`
      )
      cacheData = await GitConfigFileSystemScanner.scan(settings.projectsPath)

      // cache the data for next time
      await GitConfigsFileCacheService.saveToFile(cacheData)
    }
    // guards for array properties that were added after a file could have been written
    if (cacheData.configList?.length <= 0) {
      cacheData.configList = []
    }
    if (cacheData.warningsList?.length <= 0) {
      cacheData.warningsList = []
    }

    return cacheData
  }

  static async clearAllCaches(): Promise<void> {
    // delete the file
    return GitConfigsFileCacheService.deleteFile()
  }

  static shouldRescan(cacheData: GitConfigsModel): boolean {
    return cacheData?.configList?.length <= 0
  }
}
