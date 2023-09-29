import path from 'path'
import { UserSettings } from './UserSettings'
import os from 'os'
import { getChromeHistoryDatabasePath } from '../services/UserSettingsService'
export class DefaultSettingsWindows extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'win32'
    this.projectsPath = 'C:\\projects'
    this.sshConfigFilePath = path.join(os.homedir(), '.ssh', 'config')
    this.globalGitConfigFile = path.join(os.homedir(), '.gitconfig')
    this.chromeHistoryPath = getChromeHistoryDatabasePath('win32')
    this.hasEnabledMarketingWeek = false
  }

  platformMatcher!: string
}
