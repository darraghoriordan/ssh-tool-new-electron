import { Allow } from 'class-validator'

export class GumRoadCard {
  @Allow()
  bin!: null | string
  @Allow()
  expiry_month!: null | string
  @Allow()
  expiry_year!: null | string
  @Allow()
  type!: null | string
  @Allow()
  visual!: null | string
}
