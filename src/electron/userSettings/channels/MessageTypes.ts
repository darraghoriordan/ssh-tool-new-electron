import { UserSettings } from '../models/UserSettings'

export type SaveUserSettingsMessage = {
  settings: UserSettings
}
export type UserSettingsResponse = UserSettings
