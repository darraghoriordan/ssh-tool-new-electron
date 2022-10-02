import fsp from 'fs/promises'
import fs from 'fs'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { StoredApplicationSettings } from '../models/StoredApplicationSettings'
import { RuntimeApplicationSettings } from '../models/RuntimeApplicationSettings'
import { validate } from 'class-validator'
import { AppSettingsResponse } from '../channels/MessageTypes'

export class ApplicationSettingService {
  static runtimeSettings: RuntimeApplicationSettings

  private static loadedSettings: StoredApplicationSettings | undefined

  static init(runtimeSettings: RuntimeApplicationSettings): void {
    this.runtimeSettings = runtimeSettings
  }

  static async getSettings(): Promise<AppSettingsResponse> {
    if (this.loadedSettings === undefined) {
      console.log('cached app settings not found, loading from file...')
      this.loadedSettings = await this.loadFile(
        this.runtimeSettings.appSettingsFileLocation
      )
    }
    const runtimeSettings = this.runtimeSettings
    return {
      runtimeApplicationSettings: runtimeSettings,
      storedApplicationSettings: this.loadedSettings,
    }
  }

  static async loadFile(path: string): Promise<StoredApplicationSettings> {
    console.log(
      `loading settings file path ${this.runtimeSettings.appSettingsFileLocation}`
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
      StoredApplicationSettings,
      JSON.parse(fileUtf8)
    )
    return settingsInstance
  }

  static getDefaultSettings(): StoredApplicationSettings {
    const defaultSettingsInstance = new StoredApplicationSettings()

    return defaultSettingsInstance
  }

  static async saveFile(settings: StoredApplicationSettings): Promise<void> {
    console.log(
      `saving settings file path ${this.runtimeSettings.appSettingsFileLocation}`,
      settings
    )

    const validationErrors = await validate(
      plainToInstance(StoredApplicationSettings, settings)
    )
    if (validationErrors && validationErrors.length > 0) {
      const errors = validationErrors.map(v => v.toString())
      throw new Error(`The settings are invalid. ${''.concat(...errors)}`)
    }
    console.log('validation errors', validationErrors)
    await fsp.writeFile(
      this.runtimeSettings.appSettingsFileLocation,
      JSON.stringify(instanceToPlain(settings))
    )
    // update the cached settings
    this.loadedSettings = settings
  }

  static async deleteFile(): Promise<void> {
    console.log(
      `deleting settings file path ${this.runtimeSettings.appSettingsFileLocation}`
    )
    await fsp.rm(this.runtimeSettings.appSettingsFileLocation, { force: true })
    this.loadedSettings = undefined
  }
}
