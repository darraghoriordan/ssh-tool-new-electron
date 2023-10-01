import fsp from 'fs/promises'
import fs from 'fs'
import os from 'os'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { UserSettings } from '../models/UserSettings'
import { DefaultSettingsMac } from '../models/DefaultSettingsMac'
import { DefaultSettingsLinux } from '../models/DefaultSettingsLinux'
import { DefaultSettingsWindows } from '../models/DefaultSettingsWindows'
import { validate } from 'class-validator'
import { RuntimeApplicationSettings } from '../../appSettings/models/RuntimeApplicationSettings'

export type SupportedOS = 'linux' | 'win32' | 'darwin'
export function getChromeHistoryDatabasePath(os: SupportedOS) {
  let historyDBPath = ''
  // also check for /Profile 1/History in the various directories
  // maybe ask the user to select the profile directory in the future?
  switch (os) {
    case 'linux':
      // Typical path for Linux
      historyDBPath = `${process.env.HOME}/.config/google-chrome/Default/History`
      break
    case 'win32':
      // Typical path for Windows
      historyDBPath = `C:/Users/${process.env.USERNAME}/AppData/Local/Google/Chrome/User Data/Default/History`
      break
    case 'darwin':
      // Typical path for macOS (Darwin)
      historyDBPath = `${process.env.HOME}/Library/Application Support/Google/Chrome/Default/History`
      break
    default:
      console.error('Unsupported operating system:', os)
  }

  return historyDBPath
}
export class UserSettingsService {
  static filePath: string

  private static loadedSettings: UserSettings | undefined

  static init(runtimeApplicationSettings: RuntimeApplicationSettings): void {
    this.filePath = runtimeApplicationSettings.userSettingsFileLocation
  }

  static async getSettings(): Promise<UserSettings> {
    if (this.loadedSettings === undefined) {
      console.log(`loading settings file path ${this.filePath}`)
      this.loadedSettings = await this.loadFile(this.filePath)
    }

    return this.loadedSettings
  }

  static async loadFile(path: string): Promise<UserSettings> {
    // trying to catch the error on promises readFile still throws for some reason
    // so using this instead
    const defaultSettingsInstance = this.getDefaultSettings()
    if (!fs.existsSync(path)) {
      console.log('User settings file not found, creating new one')
      this.saveFile(defaultSettingsInstance)

      return defaultSettingsInstance
    }

    const fileUtf8 = await fsp.readFile(path, { encoding: 'utf-8' })
    console.log('Raw user settings', fileUtf8)
    const settingsInstance = plainToInstance(UserSettings, JSON.parse(fileUtf8))
    console.log('Parsed user settings', settingsInstance)
    // now add defaults for new settings that might not have been set in old installs ()
    if (
      settingsInstance.chromeHistoryPath === undefined ||
      settingsInstance.chromeHistoryPath === ''
    ) {
      settingsInstance.chromeHistoryPath =
        defaultSettingsInstance.chromeHistoryPath
    }

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
      x => x.platformMatcher === os.platform(),
    )
    if (defaultSettingsInstance === undefined) {
      throw new Error(
        "Couldn't find application configuration to run on current platform. Only mac, windows and linux supported.",
      )
    }

    return defaultSettingsInstance
  }

  static async saveFile(settings: UserSettings): Promise<void> {
    console.log(
      `saving settings file path ${UserSettingsService.filePath}`,
      settings,
    )

    // would probably want to validate the settings here
    //validateOrReject(settings)
    const validationErrors = await validate(
      plainToInstance(UserSettings, settings),
    )
    if (validationErrors && validationErrors.length > 0) {
      const errors = validationErrors.map(v => v.toString())
      throw new Error(`The settings are invalid. ${''.concat(...errors)}`)
    }
    console.log('validation errors', validationErrors)
    console.log('writing settings', { path: this.filePath, settings })
    await fsp.writeFile(
      this.filePath,
      JSON.stringify(instanceToPlain(settings)),
    )

    this.loadedSettings = settings
  }

  static async deleteFile(): Promise<void> {
    console.log(`deleting settings file path ${UserSettingsService.filePath}`)
    await fsp.rm(this.filePath, { force: true })
    this.loadedSettings = undefined
  }
}
