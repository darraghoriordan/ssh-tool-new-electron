export class LicenseDataDto {
  licenseKey?: string // cache locally
  licensedUserEmail?: string // gumroad - cache locally
  licenceCreatedDate?: Date // gumroad - cache locally
  disputed?: boolean // gumroad - cache locally
  refunded?: boolean // gumroad - cache locally
  mustEnterLicenseKey!: boolean
  isTrialling!: boolean
  trialRemainingDays!: number
  paidUpdatesRemainingDays!: number
  isLicenceValidForCurrentBuild!: boolean
}
