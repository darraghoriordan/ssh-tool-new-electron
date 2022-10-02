import { CheckLicence } from './checkLicence'

describe('checkLicense', () => {
  test.each([
    [new Date('2021-01-01'), new Date('2021-01-02'), false],
    [new Date('2021-01-01'), new Date('2021-01-14'), false],
    [new Date('2021-01-01'), new Date('2021-01-15'), false],
    [new Date('2021-01-01'), new Date('2021-01-16'), true],
  ])(
    'should return true if trial period is passed',
    async (firstRunDate: Date, nowDate: Date, expected: boolean) => {
      const result = await CheckLicence.isTrialPeriodExpired(
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
      const result = await CheckLicence.isLicenseCheckDue(firstRunDate, nowDate)

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
      const result = await CheckLicence.isLicenceValidForBuild(
        buildDate,
        licenseCreatedDate
      )

      expect(result).toBe(expected)
    }
  )
})
