import fsp from 'fs/promises'
import fs from 'fs'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'

export class GitConfigsFileCacheService {
  private static gitConfigCachePath: string

  static init({
    gitConfigurationCacheFilePath,
  }: {
    gitConfigurationCacheFilePath: string
  }): void {
    this.gitConfigCachePath = gitConfigurationCacheFilePath
  }

  static async loadFromFile(): Promise<GitConfigsModel> {
    if (!fs.existsSync(GitConfigsFileCacheService.gitConfigCachePath)) {
      const emptyResult = new GitConfigsModel()
      emptyResult.configList = []
      return emptyResult
    }

    try {
      const buffer = await fsp.readFile(
        GitConfigsFileCacheService.gitConfigCachePath
      )

      return GitConfigsFileCacheService.transformToInstance(buffer.toString())
    } catch (error) {
      console.log(
        `Error when reading file ${GitConfigsFileCacheService.gitConfigCachePath}. Will return new instance instead.`,
        error
      )
      const emptyResult = new GitConfigsModel()
      emptyResult.configList = []
      return emptyResult
    }
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
      console.log(
        `Error when deleting file ${GitConfigsFileCacheService.gitConfigCachePath}.`,
        error
      )
    }
  }
}
