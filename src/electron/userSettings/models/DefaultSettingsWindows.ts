import path from 'path'
import { UserSettings } from './UserSettings'
import os from 'os'
export class DefaultSettingsWindows extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'win32'
    this.projectsPath = 'C:\\projects'
    this.sshConfigFilePath = path.join(os.homedir(), '.ssh', 'config')
    this.globalGitConfigFile = path.join(os.homedir(), '.gitconfig')
  }

  platformMatcher!: string
}
