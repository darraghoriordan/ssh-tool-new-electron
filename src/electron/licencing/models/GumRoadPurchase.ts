import { Type } from 'class-transformer'
import { Allow } from 'class-validator'
import { GumRoadCard } from './GumRoadCard'

export class GumRoadPurchase {
  @Allow()
  seller_id!: string // 'kL0paVL1SdmJSYRNs-OCMg=='
  @Allow()
  product_id!: string //'32-nPAinqpLj0B_WIwVlMw=='
  @Allow()
  product_name!: string // 'license product'
  @Allow()
  permalink!: string //'testprod1'
  @Allow()
  product_permalink!: string // 'https!://gum.co/testprod1'
  @Allow()
  email!: string // 'sample@example.com'
  @Allow()
  price!: number // 0  - cents
  @Allow()
  gumroad_fee!: number // 0
  @Allow()
  currency!: string // 'usd'
  @Allow()
  quantity!: number // 1
  @Allow()
  discover_fee_charged!: boolean // false
  @Allow()
  can_contact!: boolean // true
  @Allow()
  test!: boolean // true
  @Allow()
  referrer!: string //'direct'

  @Type(() => GumRoadCard)
  @Allow()
  card!: GumRoadCard
  @Allow()
  order_number!: number // 524459995
  @Allow()
  sale_id!: string // 'FO8TXN-dvxYbBdahG97Y-Q=='

  sale_timestamp!: Date // '2021-01-05T19!:38!:56Z'
  @Allow()
  purchaser_id!: string //'5550311507811'
  @Allow()
  subscription_id!: string // 'GDzW4_NBdQy-o7Gjjng7lw=='
  @Allow()
  variants!: string //''
  @Allow()
  license_key!: string //'85DB262A-C19D4B06-A5335A6B-8C079166'
  @Allow()
  ip_country!: string // 'India'
  @Allow()
  recurrence!: string // 'monthly'
  @Allow()
  is_gift_receiver_purchase!: boolean //false
  @Allow()
  refunded!: boolean // false
  @Allow()
  disputed!: boolean //false
  @Allow()
  dispute_won!: boolean // false
  @Allow()
  id!: string // 'FO8TXN-dvxYbBdahG97Y-Q=='
  @Allow()
  @Type(() => Date)
  created_at!: Date //'2021-01-05T19!:38!:56Z'

  @Allow()
  @Type(() => Object)
  custom_fields!: [] // []

  @Allow()
  @Type(() => Date)
  subscription_cancelled_at: Date | undefined //'2021-02-05T20:09:27Z'
  @Allow()
  @Type(() => Date)
  subscription_failed_at: Date | undefined // null
}
