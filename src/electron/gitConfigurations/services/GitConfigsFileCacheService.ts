import fsp from 'fs/promises'
import fs from 'fs'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import { RuntimeApplicationSettings } from '../../appSettings/models/RuntimeApplicationSettings'

export class GitConfigsFileCacheService {
  private static gitConfigCachePath: string

  static init(runtimeApplicationSettings: RuntimeApplicationSettings): void {
    this.gitConfigCachePath =
      runtimeApplicationSettings.gitConfigurationCacheFilePath
  }

  static async loadFromFile(): Promise<GitConfigsModel> {
    if (!fs.existsSync(GitConfigsFileCacheService.gitConfigCachePath)) {
      console.debug('no git config file cache found.')
      return this.createEmptyResult()
    }

    try {
      const buffer = await fsp.readFile(
        GitConfigsFileCacheService.gitConfigCachePath
      )

      const latestCache = GitConfigsFileCacheService.transformToInstance(
        buffer.toString()
      )
      // if the cache was created before some properties were added, we need to fake them
      GitConfigsFileCacheService.handleOldCachedFiles(latestCache)

      return latestCache
    } catch (error) {
      console.warn(
        `Error when reading file ${GitConfigsFileCacheService.gitConfigCachePath}. Will return new instance instead.`,
        error
      )

      return this.createEmptyResult()
    }
  }
  static handleOldCachedFiles(latestCache: GitConfigsModel): void {
    if (latestCache.created === undefined) {
      latestCache.created = new Date(2000, 1, 1)
    }
    if (latestCache.configList === undefined) {
      latestCache.configList = []
    }
    if (latestCache.warningsList === undefined) {
      latestCache.warningsList = []
    }
  }
  static createEmptyResult(): GitConfigsModel {
    const emptyResult = new GitConfigsModel()
    emptyResult.configList = []
    emptyResult.warningsList = []
    return emptyResult
  }

  static transformToInstance(rawObject: string): GitConfigsModel {
    const settingsInstance = plainToInstance(
      GitConfigsModel,
      JSON.parse(rawObject)
    )
    return settingsInstance
  }

  static async saveToFile(data: GitConfigsModel): Promise<void> {
    return fsp.writeFile(
      GitConfigsFileCacheService.gitConfigCachePath,
      JSON.stringify(instanceToPlain(data))
    )
  }

  static async deleteFile(): Promise<void> {
    try {
      return fsp.rm(GitConfigsFileCacheService.gitConfigCachePath, {
        force: true,
      })
    } catch (error) {
      console.warn(
        `Error when deleting file ${GitConfigsFileCacheService.gitConfigCachePath}.`,
        error
      )
    }
  }
}
