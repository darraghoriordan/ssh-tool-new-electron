import { app } from 'electron'
import path from 'path'
import { ApplicationSettings } from './ApplicationSettings'

export class DefaultSettingsMac extends ApplicationSettings {
  constructor() {
    super()
    this.platformMatcher = 'darwin'
    this.projectsPath = path.join(app.getPath('home'), 'Documents')
    this.sshCertPath = path.join(app.getPath('home'), '.ssh')
    this.sshConfigFilePath = path.join(app.getPath('home'), '.ssh', 'config')
    this.globalGitConfigFile = path.join(app.getPath('home'), '.gitconfig')
  }

  platformMatcher!: string
}
