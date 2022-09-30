import { RuntimeApplicationSettings } from '../models/RuntimeApplicationSettings'
import { StoredApplicationSettings } from '../models/StoredApplicationSettings'

export type AppSettingsResponse = {
  storedApplicationSettings: StoredApplicationSettings
  runtimeApplicationSettings: RuntimeApplicationSettings
}
