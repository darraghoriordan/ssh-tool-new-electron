import { ApplicationSettings } from '../models/ApplicationSettings'

export type SaveSettingsMessage = {
  settings: ApplicationSettings
}
export type SettingsResponse = {
  settings: ApplicationSettings
}
