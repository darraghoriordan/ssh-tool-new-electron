import { Expose, Type } from 'class-transformer'
import { IsDate, IsInt, IsString } from 'class-validator'

export class StoredApplicationSettings {
  @Expose()
  @IsDate()
  @Type(() => Date)
  firstRunDate?: Date

  @Expose()
  @IsInt()
  numberOfApplicationRuns?: number

  @Expose()
  @IsString()
  licenseKey?: string

  @Expose()
  @IsString()
  licensedUserEmail?: string

  @Expose()
  @IsDate()
  @Type(() => Date)
  licenseCreatedOn?: Date

  @Expose()
  @IsDate()
  @Type(() => Date)
  licenseLastCheckedOnGumRoad?: Date

  @Expose()
  @IsDate()
  @Type(() => Date)
  licenseRemovedOn?: Date
}
