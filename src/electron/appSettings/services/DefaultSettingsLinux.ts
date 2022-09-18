import { ApplicationSettings } from '../ApplicationSettings'

export class DefaultSettingsLinux extends ApplicationSettings {
  constructor() {
    super()
    this.platformMatcher = 'linux'
    this.projectsPath = '~/projects'
    this.sshCertPath = '~/.ssh'
  }

  platformMatcher!: string
}
