import { app } from 'electron'
import path from 'path'
import { UserSettings } from './UserSettings'

export class DefaultSettingsWindows extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'win32'
    this.projectsPath = 'C:\\projects'
    this.sshConfigFilePath = path.join(app.getPath('home'), '.ssh', 'config')
    this.globalGitConfigFile = path.join(app.getPath('home'), '.gitconfig')
  }

  platformMatcher!: string
}
