import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ApplicationSettings } from '../ApplicationSettings'
// can't use generics with plain to class
export class ApplicationSettingsFileService {
  private filePath: string
  constructor() {
    this.filePath = path.join(app.getPath('userData'), 'appSettings.json')
  }

  async loadFile(): Promise<ApplicationSettings> {
    // trying to catch the error on readFile still throws for some reason
    if (!fs.existsSync(this.filePath)) {
      return this.getDefaultSettings()
    }

    try {
      const fileUtf8 = await fsp.readFile(this.filePath, { encoding: 'utf-8' })
      console.log('Using settings path', this.filePath)
      const settingsInstance = plainToInstance(
        ApplicationSettings,
        JSON.parse(fileUtf8)
      )
      return settingsInstance
    } catch (error) {
      console.log(
        `Error when reading file ${this.filePath} return new instance. Using defaults`,
        error
      )
      return this.getDefaultSettings()
    }
  }

  getDefaultSettings(): ApplicationSettings {
    const defaultSettings = new ApplicationSettings()
    // could drive OS specific things out of here
    defaultSettings.projectsPath = '~/projects'
    defaultSettings.sshCertPath = '~/.ssh'

    return defaultSettings
  }

  async saveFile(settings: ApplicationSettings): Promise<void> {
    return fsp.writeFile(
      this.filePath,
      JSON.stringify(instanceToPlain(settings))
    )
  }
}
