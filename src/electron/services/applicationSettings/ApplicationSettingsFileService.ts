import fsp from 'fs/promises'
import path from 'path'
import { app } from 'electron'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ApplicationSettings } from '../../appSettings/ApplicationSettings'
// can't use generics with plain to class
export class ApplicationSettingsFileService {
  private filePath: string
  constructor() {
    this.filePath = path.join(app.getPath('userData'), 'appSettings.json')
  }

  async loadFile(): Promise<ApplicationSettings> {
    try {
      const buffer = await fsp.readFile(this.filePath)
      const settingsInstance = plainToInstance(
        ApplicationSettings,
        JSON.parse(buffer.toString())
      )
      return settingsInstance
    } catch (error) {
      console.log(
        `Error when reading file ${this.filePath} return new instance.`,
        error
      )
      return new ApplicationSettings()
    }
  }

  async saveFile(settings: ApplicationSettings): Promise<void> {
    return fsp.writeFile(
      this.filePath,
      JSON.stringify(instanceToPlain(settings))
    )
  }
}
