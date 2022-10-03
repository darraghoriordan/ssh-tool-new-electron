import { plainToInstance } from 'class-transformer'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { GumRoadLicenseResponse } from '../models/GumRoadLicenseResponse'
import fetch from 'node-fetch'

export class GumRoadLicenseService {
  static productPermalink = 'localtools'
  static updateStoredLicence = async (
    licenceKey: string,
    incrementUses: boolean
  ) => {
    const { storedApplicationSettings } =
      await ApplicationSettingService.getSettings()
    try {
      const licenseOnGumRoad = await this.getLicenseOnGumRoad(
        // we know license is available from a previous check so we can use ! here
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        licenceKey,
        this.productPermalink,
        incrementUses
      )

      // ok so update the local settings with all the gumroad data
      storedApplicationSettings.licenseKey = licenceKey
      storedApplicationSettings.licensedUserEmail =
        licenseOnGumRoad.purchase.email
      storedApplicationSettings.licenseCreatedOn =
        licenseOnGumRoad.purchase.created_at
      storedApplicationSettings.licenseDisputed =
        licenseOnGumRoad.purchase.disputed
      storedApplicationSettings.licenseRefunded =
        licenseOnGumRoad.purchase.refunded
    } catch (error) {
      // store this error somewhere maybe?
      console.error('Error validating license on Gumroad', error)
    } finally {
      storedApplicationSettings.licenseLastCheckedOnGumRoad = new Date()
      await ApplicationSettingService.saveFile(storedApplicationSettings)
    }
  }

  static async getLicenseOnGumRoad(
    licenseKey: string,
    productPermaLink: string,
    incrementUses: boolean
  ): Promise<GumRoadLicenseResponse> {
    try {
      // call gumroad api to validate license
      const result = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        body: JSON.stringify({
          product_permalink: productPermaLink,
          license_key: licenseKey,
          increment_uses_count: incrementUses,
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
}
