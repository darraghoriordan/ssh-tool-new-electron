import path from 'path'
import { UserSettings } from './UserSettings'
import os from 'os'
import { getChromeHistoryDatabasePath } from '../services/UserSettingsService'

export class DefaultSettingsMac extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'darwin'
    this.projectsPath = path.join(os.homedir(), 'Documents')
    this.sshConfigFilePath = path.join(os.homedir(), '.ssh', 'config')
    this.globalGitConfigFile = path.join(os.homedir(), '.gitconfig')
    this.chromeHistoryPath = getChromeHistoryDatabasePath('darwin')
  }

  platformMatcher!: string
}
