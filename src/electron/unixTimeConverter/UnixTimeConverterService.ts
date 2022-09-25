import { UnixTimeConverterResponse } from './channels/MessageTypes'
import { formatDistance, formatISO } from 'date-fns'

export class UnixTimeConverter {
  static convert(input: string, now: Date): UnixTimeConverterResponse {
    const trimmedInput = input.trim()
    // check if a string only contains numbers and is 10 characters long
    const isUnixTimestamp = /^\d{10}$/.test(trimmedInput)

    // check if the string is an iso date - https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
    const isAnISODate =
      /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.test(
        trimmedInput
      )

    if (!isUnixTimestamp && !isAnISODate) {
      throw new Error(
        'Invalid input. Input must be an ISO date or unix timestamp'
      )
    }

    let inputAsDate: Date | undefined

    if (isUnixTimestamp) {
      const milliSeconds = parseInt(trimmedInput, 10) * 1000

      inputAsDate = new Date(milliSeconds)
    } else {
      inputAsDate = new Date(trimmedInput)
    }

    return {
      utcDate: inputAsDate.toISOString(),
      isoDate: formatISO(inputAsDate),
      localeDate: inputAsDate.toLocaleString(),
      unixTimestamp: inputAsDate.getTime() / 1000,
      differenceFromNow: formatDistance(inputAsDate, now, {
        addSuffix: true,
        includeSeconds: true,
      }),
    }
  }
}
