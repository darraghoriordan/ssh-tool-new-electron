import { PaidLicensingService } from './paidLicencingService'

describe('checkLicense', () => {
  test.each([
    [new Date('2021-01-01'), new Date('2021-01-02'), 13],
    [new Date('2021-01-01'), new Date('2021-01-14'), 1],
    [new Date('2021-01-01'), new Date('2021-01-15'), 0],
    [new Date('2021-01-01'), new Date('2021-01-16'), 0],
  ])(
    'should return true if trial period days remaining are as expected',
    async (firstRunDate: Date, nowDate: Date, expected: number) => {
      const result = await PaidLicensingService.getRemainingDaysInTrialPeriod(
        firstRunDate,
        nowDate
      )

      expect(result).toBe(expected)
    }
  )

  test.each([
    [new Date('2021-01-05T19:38:56Z'), new Date('2021-01-05T19:38:56Z'), false],
    [new Date('2021-01-05T19:38:56Z'), new Date('2021-01-06T20:38:57Z'), true],
    [new Date('2021-01-05T19:38:56Z'), new Date('2021-01-06T19:38:54Z'), false],
  ])(
    'should return true if check is due',
    async (firstRunDate: Date, nowDate: Date, expected: boolean) => {
      const result = await PaidLicensingService.isLicenseCheckDue(
        firstRunDate,
        nowDate
      )

      expect(result).toBe(expected)
    }
  )

  test.each([
    // build newer than license allows
    [new Date('2022-01-01T19:38:56Z'), new Date('2020-01-05T19:38:56Z'), false],
    // build older than license allows
    [new Date('2021-01-05T19:38:56Z'), new Date('2021-05-06T20:38:57Z'), true],
    // build very old compared to license allows
    [new Date('1970-01-05T19:38:56Z'), new Date('2021-05-06T20:38:57Z'), true],
    // if we cant read build date we assume its valid
    [undefined, new Date('2021-01-06T19:38:54Z'), true],
  ])(
    'should return true if updates are allowed',
    async (
      buildDate: Date | undefined,
      licenseCreatedDate: Date,
      expected: boolean
    ) => {
      const result = await PaidLicensingService.isLicenceValidForCurrentBuild(
        buildDate,
        licenseCreatedDate
      )

      expect(result).toBe(expected)
    }
  )
})

test.each([
  [new Date('2021-01-01'), new Date('2021-01-02'), 365],
  [new Date('2021-01-01'), new Date('2021-12-26'), 7],
  [new Date('2021-01-01'), new Date('2023-01-15'), 0],
  [new Date('2021-01-01'), new Date('2022-01-02'), 0],
])(
  'should match the number of days remaining allowed for updates',
  async (licenceCreatedDate: Date, nowDate: Date, expected: number) => {
    const result = await PaidLicensingService.getRemainingDaysOfUpdates(
      licenceCreatedDate,
      nowDate
    )

    expect(result).toBe(expected)
  }
)

test.each([
  [{ disputed: true, refunded: true }, true, true], // disputed and refunded
  [{ disputed: false, refunded: true }, true, true], // refunded
  [{ disputed: true, refunded: false }, true, true], // disputed
  [{ disputed: false, refunded: false }, true, false], // all good
  [{ disputed: false, refunded: false }, false, true], // licence not valid for current build
  [{ disputed: true, refunded: true }, false, true], // all bad
])(
  'should create expected paid licence dto',
  async (
    appSettings: { disputed: boolean; refunded: boolean },
    isLicenceValidForCurrentBuild: boolean,
    expectedMustEnterLicenseKey: boolean
  ) => {
    const result = await PaidLicensingService.createPaidLicenseDto(
      {
        licenseKey: 'key',
        licensedUserEmail: 'email',
        licenseCreatedOn: new Date('2021-01-01'),
        licenseDisputed: appSettings.disputed,
        licenseRefunded: appSettings.refunded,
      } as any,
      5,
      isLicenceValidForCurrentBuild
    )

    expect(result.mustEnterLicenseKey).toBe(expectedMustEnterLicenseKey)

    expect(result.isTrialling).toBe(false)
    expect(result.trialRemainingDays).toBe(0)
    expect(result.paidUpdatesRemainingDays).toBe(5)
    expect(result.licensedUserEmail).toBe('email')
    expect(result.licenseKey).toBe('key')
  }
)

test.each([
  [100, false],
  [0, true],
  [-1, true],
  [1, false],
])(
  'should match the number of days remaining allowed for updates',
  async (trialRemainingDays: number, expected: boolean) => {
    const result = await PaidLicensingService.createTrialLicenceDto(
      trialRemainingDays
    )

    expect(result.mustEnterLicenseKey).toBe(expected)
    expect(result.isTrialling).toBe(true)
    expect(result.trialRemainingDays).toBe(trialRemainingDays)
    expect(result.paidUpdatesRemainingDays).toBe(366)
    expect(result.isLicenceValidForCurrentBuild).toBe(true)
  }
)
