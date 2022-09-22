import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import { GitConfigsFileCacheService } from './GitConfigsFileCacheService'
import GitConfigFileSystemScanner from './GitConfigFileSystemScanner'

export class GitConfigsService {
  static async loadGitConfigs(): Promise<GitConfigsModel> {
    const settings = await ApplicationSettingService.getSettings()

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

  static shouldRescan(cacheData: GitConfigsModel): boolean {
    return cacheData?.configList?.length <= 0
  }
}
