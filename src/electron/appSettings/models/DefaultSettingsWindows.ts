import { app } from 'electron'
import path from 'path'
import { ApplicationSettings } from './ApplicationSettings'

export class DefaultSettingsWindows extends ApplicationSettings {
  constructor() {
    super()
    this.platformMatcher = 'win32'
    this.projectsPath = '~/projects'
    this.sshCertPath = '~/.ssh'
    this.sshConfigFilePath = path.join(app.getPath('home'), '.ssh', 'config')
    this.globalGitConfigFile = path.join(app.getPath('home'), '.gitconfig')
  }

  platformMatcher!: string
}
