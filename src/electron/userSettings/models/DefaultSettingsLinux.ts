import path from 'path'
import { UserSettings } from './UserSettings'
import os from 'os'
import { getChromeHistoryDatabasePath } from '../services/UserSettingsService'

export class DefaultSettingsLinux extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'linux'
    this.projectsPath = '~/projects'
    this.sshConfigFilePath = path.join(os.homedir(), '.ssh', 'config')
    this.globalGitConfigFile = path.join(os.homedir(), '.gitconfig')
    this.chromeHistoryPath = getChromeHistoryDatabasePath('linux')
  }

  platformMatcher!: string
}
