import { ApplicationSettings } from './ApplicationSettings'

export type SaveSettingsMessage = {
  settings: ApplicationSettings
}
export type SettingsResponse = {
  settings: ApplicationSettings
}
