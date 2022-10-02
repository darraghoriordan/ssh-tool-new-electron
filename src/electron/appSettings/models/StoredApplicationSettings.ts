import { Expose, Type } from 'class-transformer'
import { IsBoolean, IsDate, IsInt, IsOptional, IsString } from 'class-validator'

export class StoredApplicationSettings {
  @Expose()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  firstRunDate?: Date

  @Expose()
  @IsInt()
  @IsOptional()
  numberOfApplicationRuns?: number

  @Expose()
  @IsString()
  @IsOptional()
  licenseKey?: string

  @Expose()
  @IsString()
  @IsOptional()
  licensedUserEmail?: string

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  licenseCreatedOn?: Date

  @Expose()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  licenseLastCheckedOnGumRoad?: Date

  @Expose()
  @IsBoolean()
  @IsOptional()
  licenseDisputed?: boolean // gumroad - cache locally

  @Expose()
  @IsBoolean()
  @IsOptional()
  licenseRefunded?: boolean // gumroad - cache locally
}
