import { Type } from 'class-transformer'
import { Allow } from 'class-validator'
import { GumRoadPurchase } from './GumRoadPurchase'

export class GumRoadLicenseResponse {
  @Allow()
  public success!: boolean

  @Allow()
  public uses!: number

  @Allow()
  @Type(() => GumRoadPurchase)
  public purchase!: GumRoadPurchase
}
