import { HtmlEncoderType } from '../HtmlEncoderService'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type HtmlEncoderMessage = {
  data: string
  encode: boolean
  type: HtmlEncoderType
}

export type HtmlEncoderResponse = {
  result: string
}
