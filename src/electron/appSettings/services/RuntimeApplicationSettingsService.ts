import { app } from 'electron'
import path from 'path'
import { RuntimeApplicationSettings } from '../models/RuntimeApplicationSettings'

// This is just a facade for these electron things
// will be easier to test later
export class RuntimeApplicationSettingsService {
  public static getSettings(): RuntimeApplicationSettings {
    return {
      userSettingsFileLocation: path.join(
        app.getPath('userData'),
        'userSettings.json'
      ),
      appSettingsFileLocation: path.join(
        app.getPath('userData'),
        'appSettings.json'
      ),
      gitConfigurationCacheFilePath: path.join(
        app.getPath('userData'),
        'gitConfigurationCache.json'
      ),
      appVersion: app.getVersion(),
    }
  }
}
