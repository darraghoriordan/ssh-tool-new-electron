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

    return cacheData
  }

  static async clearAllCaches(): Promise<void> {
    return GitConfigsFileCacheService.deleteFile()
  }

  static shouldRescan(cacheData: GitConfigsModel): boolean {
    return (
      GitConfigsService.noData(cacheData) ||
      GitConfigsService.dataIsOld(cacheData)
    )
  }
  static noData(cacheData: GitConfigsModel): boolean {
    return cacheData?.configList?.length <= 0
  }
  static dataIsOld(cacheData: GitConfigsModel): boolean {
    return (
      cacheData.created === undefined ||
      new Date(cacheData.created).getTime() <
        new Date().getTime() - 1000 * 60 * 60 * 24 * 7
    )
  }
}
