import { ApplicationSettings } from '../ApplicationSettings'

export class DefaultSettingsWindows extends ApplicationSettings {
  constructor() {
    super()
    this.platformMatcher = 'win32'
    this.projectsPath = '~/projects'
    this.sshCertPath = '~/.ssh'
  }

  platformMatcher!: string
}
