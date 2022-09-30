import { app } from 'electron'
import path from 'path'
import { UserSettings } from './UserSettings'

export class DefaultSettingsMac extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'darwin'
    this.projectsPath = path.join(app.getPath('home'), 'Documents')
    this.sshConfigFilePath = path.join(app.getPath('home'), '.ssh', 'config')
    this.globalGitConfigFile = path.join(app.getPath('home'), '.gitconfig')
  }

  platformMatcher!: string
}
