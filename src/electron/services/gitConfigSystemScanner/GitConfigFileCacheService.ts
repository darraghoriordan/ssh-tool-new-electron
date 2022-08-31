import fsp from 'fs/promises'
import path from 'path'
import { app } from 'electron'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { GitConfigFileSystemScannerResponse } from '../gitConfigSystemScanner/models/GitConfigFileSystemScannerResponse'
// can't use generics with plain to class
export class GitConfigFileCacheService {
  async loadFile(): Promise<GitConfigFileSystemScannerResponse> {
    const filePath = path.join(app.getPath('userData'), 'gitConfiguration.json')
    try {
      const buffer = await fsp.readFile(filePath)

      return this.transformToInstance(buffer.toString())
    } catch (error) {
      console.log(
        `Error when reading file ${filePath} return new instance.`,
        error
      )
      return new GitConfigFileSystemScannerResponse()
    }
  }

  transformToInstance(rawObject: string): GitConfigFileSystemScannerResponse {
    const settingsInstance = plainToInstance(
      GitConfigFileSystemScannerResponse,
      JSON.parse(rawObject)
    )
    console.log('FOUND GITHUB CONFIG')
    console.log(settingsInstance)
    return settingsInstance
  }

  async saveFile(settings: GitConfigFileSystemScannerResponse): Promise<void> {
    const filePath = path.join(app.getPath('userData'), 'gitConfiguration.json')
    return fsp.writeFile(filePath, JSON.stringify(instanceToPlain(settings)))
  }
}
