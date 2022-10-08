import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { differenceInDays, differenceInHours } from 'date-fns'
import { LicenseDataDto } from '../models/LicenseDataDto'
import { GumRoadLicenseService } from './gumRoadLicenceService'
import { buildDate } from '../buildSettings'
import { StoredApplicationSettings } from '../../appSettings/models/StoredApplicationSettings'
import { licensingLimits } from './licensingLimits'

export class PaidLicensingService {
  static async setLicenseKey(licenseKey: string): Promise<LicenseDataDto> {
    // currently, if this fails, we just return the current license state
    // it won't clear any data
    await GumRoadLicenseService.updateStoredLicence(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      licenseKey,
      true
    )

    // refresh the settings because we may have updated them
    const applicationSettings = await ApplicationSettingService.getSettings()

    // and now generate the licence dto to return to customers
    const result = this.createPaidLicenseDto(
      applicationSettings.storedApplicationSettings,
      this.getRemainingDaysOfUpdates(
        applicationSettings.storedApplicationSettings.licenseCreatedOn,
        new Date()
      ),
      this.isLicenceValidForCurrentBuild(
        new Date(buildDate),
        applicationSettings.storedApplicationSettings.licenseCreatedOn
      )
    )
    if (!result.licenseKey) {
      throw new Error(
        'License key not accepted. Please check your key and try again.'
      )
    }
    return result
  }

  static async getCurrentLicenseState(): Promise<LicenseDataDto> {
    // is there a local license?
    let applicationSettings = await ApplicationSettingService.getSettings()
    const licensePresent = this.isLicensePresent(
      applicationSettings.storedApplicationSettings.licenseKey
    )

    if (!licensePresent) {
      // no licence so check if trial is ongoing
      const trialRemainingDays = this.getRemainingDaysInTrialPeriod(
        applicationSettings.storedApplicationSettings.firstRunDate,
        new Date()
      )
      // return a DTO for the trial licence
      const licenseData =
        PaidLicensingService.createTrialLicenceDto(trialRemainingDays)
      return licenseData
    }

    // otherwise we have a license, is it time to check gum road for updates??
    const isLicenseCheckDue = this.isLicenseCheckDue(
      applicationSettings.storedApplicationSettings.licenseLastCheckedOnGumRoad,
      new Date()
    )

    if (isLicenseCheckDue) {
      // ok we have to refresh the local license from gumroad
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await GumRoadLicenseService.updateStoredLicence(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        applicationSettings.storedApplicationSettings.licenseKey!,
        false
      )
    }

    // refresh the settings because we may have updated them
    applicationSettings = await ApplicationSettingService.getSettings()

    // and now generate the licence dto to return to customers
    return this.createPaidLicenseDto(
      applicationSettings.storedApplicationSettings,
      this.getRemainingDaysOfUpdates(
        applicationSettings.storedApplicationSettings.licenseCreatedOn,
        new Date()
      ),
      this.isLicenceValidForCurrentBuild(
        new Date(buildDate),
        applicationSettings.storedApplicationSettings.licenseCreatedOn
      )
    )
  }
  public static createPaidLicenseDto(
    applicationSettings: StoredApplicationSettings,
    paidUpdatesRemainingDays: number,
    isLicenceValidForCurrentBuild: boolean
  ): LicenseDataDto {
    const licenseData = new LicenseDataDto()
    licenseData.licenseTermSentence =
      'Perpetual use license. Mac and Windows. 1 year of updates.'
    licenseData.licenseKey = applicationSettings.licenseKey
    licenseData.licensedUserEmail = applicationSettings.licensedUserEmail
    licenseData.licenceCreatedDate = applicationSettings.licenseCreatedOn
    licenseData.disputed = applicationSettings.licenseDisputed
    licenseData.refunded = applicationSettings.licenseRefunded
    licenseData.isTrialling = false
    licenseData.trialRemainingDays = 0
    licenseData.paidUpdatesRemainingDays = paidUpdatesRemainingDays
    licenseData.isLicenceValidForCurrentBuild = isLicenceValidForCurrentBuild
    licenseData.mustEnterLicenseKey =
      licenseData.disputed ||
      licenseData.refunded ||
      !licenseData.isLicenceValidForCurrentBuild

    return licenseData
  }
  public static createTrialLicenceDto(
    trialRemainingDays: number
  ): LicenseDataDto {
    const licenseData = new LicenseDataDto()

    licenseData.paidUpdatesRemainingDays = 366
    licenseData.isTrialling = true
    licenseData.isLicenceValidForCurrentBuild = true
    // if no license, is the trial period up?
    licenseData.trialRemainingDays = trialRemainingDays
    licenseData.mustEnterLicenseKey = licenseData.trialRemainingDays <= 0
    return licenseData
  }

  static isLicenseCheckDue(
    licenceLastChecked: Date | undefined,
    nowDate: Date
  ): boolean {
    if (!licenceLastChecked) {
      return false
    }
    return (
      differenceInHours(nowDate, licenceLastChecked) >
      licensingLimits.licenceRecheckPeriodInHours
    )
  }
  private static isLicensePresent(licenseKey: string | undefined): boolean {
    return licenseKey !== undefined && licenseKey !== ''
  }

  static getRemainingDaysOfUpdates(
    licenceCreatedDate: Date | undefined,
    nowDate: Date
  ): number {
    if (licenceCreatedDate === undefined) {
      return 366 // if this breaks don't break the app for customers
    }
    const value =
      licensingLimits.licenceValidForNewBuildsInDays -
      differenceInDays(nowDate, licenceCreatedDate)
    return value > 0 ? value : 0
  }

  static isLicenceValidForCurrentBuild(
    buildDate: Date | undefined,
    licenceCreated: Date | undefined
  ): boolean {
    if (buildDate === undefined || licenceCreated === undefined) {
      return true // if this breaks don't break the app for customers
    }
    const diffDays = differenceInDays(buildDate, licenceCreated)
    return diffDays <= licensingLimits.licenceValidForNewBuildsInDays
  }

  static getRemainingDaysInTrialPeriod(
    firstRunDate: Date | undefined,
    nowDate: Date
  ): number {
    if (firstRunDate === undefined) {
      return licensingLimits.trialPeriodDays
    }

    const value =
      licensingLimits.trialPeriodDays - differenceInDays(nowDate, firstRunDate)

    return value > 0 ? value : 0
  }
}
