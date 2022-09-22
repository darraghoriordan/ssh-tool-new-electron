import fsp from 'fs/promises'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { GitConfigFileListCacheModel } from '../models/GitConfigFileListCacheModel'

export class GitConfigFileCacheService {
  private static gitConfigCachePath: string

  static init({
    gitConfigurationCacheFilePath,
  }: {
    gitConfigurationCacheFilePath: string
  }): void {
    this.gitConfigCachePath = gitConfigurationCacheFilePath
  }

  static async loadFile(): Promise<GitConfigFileListCacheModel> {
    try {
      const buffer = await fsp.readFile(
        GitConfigFileCacheService.gitConfigCachePath
      )

      return GitConfigFileCacheService.transformToInstance(buffer.toString())
    } catch (error) {
      console.log(
        `Error when reading file ${GitConfigFileCacheService.gitConfigCachePath}. Will return new instance instead.`,
        error
      )
      const emptyResult = new GitConfigFileListCacheModel()
      emptyResult.configList = []
      return emptyResult
    }
  }

  static transformToInstance(rawObject: string): GitConfigFileListCacheModel {
    const settingsInstance = plainToInstance(
      GitConfigFileListCacheModel,
      JSON.parse(rawObject)
    )
    return settingsInstance
  }

  static async saveFile(data: GitConfigFileListCacheModel): Promise<void> {
    return fsp.writeFile(
      GitConfigFileCacheService.gitConfigCachePath,
      JSON.stringify(instanceToPlain(data))
    )
  }

  static async deleteFile(): Promise<void> {
    return fsp.rm(GitConfigFileCacheService.gitConfigCachePath, { force: true })
  }
}
