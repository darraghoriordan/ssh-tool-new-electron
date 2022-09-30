import { app } from 'electron'
import path from 'path'
import { UserSettings } from './UserSettings'

export class DefaultSettingsLinux extends UserSettings {
  constructor() {
    super()
    this.platformMatcher = 'linux'
    this.projectsPath = '~/projects'
    this.sshConfigFilePath = path.join(app.getPath('home'), '.ssh', 'config')
    this.globalGitConfigFile = path.join(app.getPath('home'), '.gitconfig')
  }

  platformMatcher!: string
}
