import fsp from 'fs/promises'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { SshCertFileCache } from './SshCertFileCache'
// can't use generics with plain to class
export class SshCertFileCacheService {
  static sshCertCacheFilePath: string

  static init({
    sshCertCacheFilePath,
  }: {
    sshCertCacheFilePath: string
  }): void {
    SshCertFileCacheService.sshCertCacheFilePath = sshCertCacheFilePath
  }
  async loadFile(): Promise<SshCertFileCache> {
    const filePath = SshCertFileCacheService.sshCertCacheFilePath
    try {
      const buffer = await fsp.readFile(filePath)

      return this.transformToInstance(buffer.toString())
    } catch (error) {
      console.log(
        `Error when reading file ${filePath} return new instance.`,
        error
      )
      return new SshCertFileCache()
    }
  }

  transformToInstance(rawObject: string): SshCertFileCache {
    const settingsInstance = plainToInstance(
      SshCertFileCache,
      JSON.parse(rawObject)
    )
    console.log('Found ssh cert cache')
    console.log(settingsInstance)
    return settingsInstance
  }

  async saveFile(settings: SshCertFileCache): Promise<void> {
    const filePath = SshCertFileCacheService.sshCertCacheFilePath
    return fsp.writeFile(filePath, JSON.stringify(instanceToPlain(settings)))
  }
}
