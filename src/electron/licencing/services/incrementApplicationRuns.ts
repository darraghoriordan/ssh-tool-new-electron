import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'

export class IncrementApplicationRuns {
  static async increment(): Promise<void> {
    const { storedApplicationSettings } =
      await ApplicationSettingService.getSettings()
    if (!storedApplicationSettings.numberOfApplicationRuns) {
      storedApplicationSettings.numberOfApplicationRuns = 1
    } else {
      storedApplicationSettings.numberOfApplicationRuns += 1
    }

    await ApplicationSettingService.saveFile(storedApplicationSettings)
  }
}
