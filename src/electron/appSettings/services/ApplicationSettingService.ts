import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { app } from 'electron'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ApplicationSettings } from '../models/ApplicationSettings'
import { DefaultSettingsMac } from '../models/DefaultSettingsMac'
import { DefaultSettingsLinux } from '../models/DefaultSettingsLinux'
import { DefaultSettingsWindows } from '../models/DefaultSettingsWindows'
import { validate } from 'class-validator'

export class ApplicationSettingService {
  private static filePath: string = path.join(
    app.getPath('userData'),
    'appSettings.json'
  )

  private static loadedSettings: ApplicationSettings

  static async getSettings(): Promise<ApplicationSettings> {
    if (this.loadedSettings === undefined) {
      this.loadedSettings = await this.loadFile(this.filePath)
    }

    return this.loadedSettings
  }

  static async loadFile(path: string): Promise<ApplicationSettings> {
    console.log(
      `loading settings file path ${ApplicationSettingService.filePath}`
    )
    // trying to catch the error on promises readFile still throws for some reason
    // so using this instead
    if (!fs.existsSync(path)) {
      const settingsInstance = this.getDefaultSettings()
      this.saveFile(settingsInstance)

      return settingsInstance
    }

    const fileUtf8 = await fsp.readFile(path, { encoding: 'utf-8' })

    const settingsInstance = plainToInstance(
      ApplicationSettings,
      JSON.parse(fileUtf8)
    )
    return settingsInstance
  }

  static getDefaultSettings():
    | DefaultSettingsLinux
    | DefaultSettingsMac
    | DefaultSettingsWindows {
    const defaultSettings = [
      new DefaultSettingsMac(),
      new DefaultSettingsWindows(),
      new DefaultSettingsLinux(),
    ]

    const defaultSettingsInstance = defaultSettings.find(
      x => x.platformMatcher === os.platform()
    )
    if (defaultSettingsInstance === undefined) {
      throw new Error(
        "Couldn't find application configuration to run on current platform. Only mac, windows and linux supported."
      )
    }

    return defaultSettingsInstance
  }

  static async saveFile(settings: ApplicationSettings): Promise<void> {
    console.log(
      `saving settings file path ${ApplicationSettingService.filePath}`,
      settings
    )

    // would probably want to validate the settings here
    //validateOrReject(settings)
    const validationErrors = await validate(
      plainToInstance(ApplicationSettings, settings)
    )
    if (validationErrors && validationErrors.length > 0) {
      const errors = validationErrors.map(v => v.toString())
      throw new Error(`The settings are invalid. ${''.concat(...errors)}`)
    }
    console.log('validation errors', validationErrors)
    await fsp.writeFile(
      this.filePath,
      JSON.stringify(instanceToPlain(settings))
    )

    this.loadedSettings = settings
  }
}
