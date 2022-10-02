import { plainToInstance } from 'class-transformer'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { GumRoadLicenseResponse } from '../models/GumRoadLicenseResponse'
import { differenceInDays, differenceInHours } from 'date-fns'
import fetch from 'node-fetch'
import { buildDate } from '../buildDate'

export class CheckLicence {
  static trialPeriodDays = 14
  static licenceRecheckPeriodInHours = 24
  static licenceValidForNewBuildsInDays = 366
  static productPermalink = 'localtools'

  static async checkLicenceIsValid(): Promise<{
    validLicensePresent: boolean
    trialPeriodExpired: boolean
  }> {
    // is there a local license?
    const { storedApplicationSettings } =
      await ApplicationSettingService.getSettings()
    const licensePresent = this.isLicensePresent(
      storedApplicationSettings.licenseKey
    )

    if (!licensePresent) {
      // if no license, is the trial period up?
      const trialPeriodExpired = this.isTrialPeriodExpired(
        storedApplicationSettings.firstRunDate,
        new Date()
      )

      return {
        validLicensePresent: false,
        trialPeriodExpired: trialPeriodExpired,
      }
    }

    // other wise we have a license, is it valid?
    const isLicenseCheckDue = this.isLicenseCheckDue(
      storedApplicationSettings.licenseLastCheckedOnGumRoad,
      new Date()
    )

    if (!isLicenseCheckDue) {
      return { validLicensePresent: licensePresent, trialPeriodExpired: false }
    }

    // ok we have to check the license on gumroad
    try {
      const licenseOnGumRoad = await this.getLicenseOnGumRoad(
        // we know license is available from a previous check
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        storedApplicationSettings.licenseKey!,
        this.productPermalink
      )
      const isLicenseValidOnGumRoad =
        licenseOnGumRoad.success &&
        !licenseOnGumRoad.purchase.disputed &&
        !licenseOnGumRoad.purchase.refunded &&
        this.isLicenceValidForBuild(
          new Date(buildDate),
          licenseOnGumRoad.purchase.created_at
        )

      if (!isLicenseValidOnGumRoad) {
        // remove details from settings so we stop checking gumroad
        storedApplicationSettings.licenseKey = undefined
        storedApplicationSettings.licensedUserEmail = undefined
        storedApplicationSettings.licenseLastCheckedOnGumRoad = new Date()
        storedApplicationSettings.licenseRemovedOn = new Date()

        return { validLicensePresent: false, trialPeriodExpired: false }
      }
    } catch (error) {
      // store this error somewhere maybe?
      console.error('Error validating license on Gumroad', error)
      storedApplicationSettings.licenseLastCheckedOnGumRoad = new Date()
    } finally {
      await ApplicationSettingService.saveFile(storedApplicationSettings)
    }

    // let customers use the app as the default
    return { validLicensePresent: true, trialPeriodExpired: false }
  }

  static async getLicenseOnGumRoad(
    licenseKey: string,
    productPermaLink: string
  ): Promise<GumRoadLicenseResponse> {
    try {
      // call gumroad api to validate license
      const result = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        body: JSON.stringify({
          product_permalink: productPermaLink,
          license_key: licenseKey,
          increment_uses_count: false,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (result.status !== 200) {
        throw new Error('Api returned status code ' + result.status)
      }
      const body = await result.json()

      // parse result
      const parsedResult = plainToInstance(GumRoadLicenseResponse, body)

      return parsedResult
    } catch (error) {
      // give the customer the benefit of the doubt
      console.log('Error making http call to Gumroad', error)
      throw new Error('Error getting license on Gumroad')
    }
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
      this.licenceRecheckPeriodInHours
    )
  }
  private static isLicensePresent(licenseKey: string | undefined): boolean {
    return licenseKey !== undefined && licenseKey !== ''
  }

  static isLicenceValidForBuild(
    buildDate: Date | undefined,
    licenceCreated: Date | undefined
  ): boolean {
    if (buildDate === undefined || licenceCreated === undefined) {
      return true // if this breaks don't break the app for customers
    }
    const diffDays = differenceInDays(buildDate, licenceCreated)
    return diffDays <= this.licenceValidForNewBuildsInDays
  }

  static isTrialPeriodExpired(
    firstRunDate: Date | undefined,
    nowDate: Date
  ): boolean {
    if (firstRunDate === undefined) {
      return false
    }

    return differenceInDays(nowDate, firstRunDate) > this.trialPeriodDays
  }
}
