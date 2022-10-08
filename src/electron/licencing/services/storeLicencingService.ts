import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { LicenseDataDto } from '../models/LicenseDataDto'
import { StoredApplicationSettings } from '../../appSettings/models/StoredApplicationSettings'

export class StoreLicensingService {
  static async getCurrentLicenseState(): Promise<LicenseDataDto> {
    const applicationSettings = await ApplicationSettingService.getSettings()

    // and now generate the licence dto to return to customers
    return this.createPaidLicenseDto(
      applicationSettings.storedApplicationSettings
    )
  }
  public static createPaidLicenseDto(
    applicationSettings: StoredApplicationSettings
  ): LicenseDataDto {
    const licenseData = new LicenseDataDto()
    licenseData.licenseTermSentence = 'Store license. Single OS. Store updates'
    licenseData.licenseKey = 'Store license'
    licenseData.licensedUserEmail = 'storeuser@store.com'
    licenseData.licenceCreatedDate = applicationSettings.firstRunDate
    licenseData.disputed = false
    licenseData.refunded = false
    licenseData.isTrialling = false
    licenseData.trialRemainingDays = 0
    licenseData.paidUpdatesRemainingDays = 20000
    licenseData.isLicenceValidForCurrentBuild = true
    licenseData.mustEnterLicenseKey = false

    return licenseData
  }
}
