import { ApplicationSettings } from '../ApplicationSettings'

export class DefaultSettingsMac extends ApplicationSettings {
  constructor() {
    super()
    this.platformMatcher = 'darwin'
    this.projectsPath = '~/projects'
    this.sshCertPath = '~/.ssh'
  }

  platformMatcher!: string
}
