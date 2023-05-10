/* eslint-disable @typescript-eslint/no-explicit-any */
export type UnixTimeConverterMessage = {
  unixTimestamp: string
  locale: string
}

export type UnixTimeConverterResponse = {
  utcDate: string
  localeDate: string
  isoDate: string
  unixTimestamp: number
  differenceFromNow: string
}
