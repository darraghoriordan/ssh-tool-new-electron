import { Expose, Type } from 'class-transformer'
import { IsDate } from 'class-validator'

export class StoredApplicationSettings {
  @Expose()
  @IsDate()
  @Type(() => Date)
  firstRunDate?: Date
}
