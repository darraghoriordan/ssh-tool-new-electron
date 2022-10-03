import { GumRoadLicenseService } from './gumRoadLicenceService'

describe('integrationLicenseOnGumroad', () => {
  const testKey = 'A7D129B3-53C34643-809BDAC4-C2521AC1'

  // skip because not a unit test - this has to call
  // gumroad to check the license
  it.skip('should return true if license is valid', async () => {
    const license = await GumRoadLicenseService.getLicenseOnGumRoad(
      testKey,
      GumRoadLicenseService.productPermalink,
      false
    )
    console.log('license', license)
    expect(license.purchase.license_key).toEqual(testKey)
    expect(license.success).toEqual(true)
    expect(license.purchase.disputed).toEqual(false)
    expect(license.purchase.refunded).toEqual(false)
    expect(license.purchase.subscription_cancelled_at).toEqual(undefined)
    expect(license.purchase.subscription_failed_at).toEqual(undefined)
    expect(license.purchase.created_at).toEqual(
      new Date('2022-10-02T02:30:57.000Z')
    )
  })
})
