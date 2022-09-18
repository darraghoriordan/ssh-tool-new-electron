import { app } from 'electron'
import path from 'path'
import { ApplicationSettings } from './ApplicationSettings'

export class DefaultSettingsMac extends ApplicationSettings {
  constructor() {
    super()
    this.platformMatcher = 'darwin'
    this.projectsPath = '~/projects'
    this.sshCertPath = '~/.ssh'
    this.globalGitConfigFile = path.join(app.getPath('home'), '.gitconfig')
  }

  platformMatcher!: string
}
