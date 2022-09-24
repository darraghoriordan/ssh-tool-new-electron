import { UnixTimeConverterResponse } from './channels/MessageTypes'
import { formatDistance, formatISO } from 'date-fns'

export class UnixTimeConverter {
  static convert(input: string, now: Date): UnixTimeConverterResponse {
    const milliSeconds = parseInt(input, 10) * 1000

    const inputAsDate = new Date(milliSeconds)

    return {
      utcDate: inputAsDate.toISOString(),
      isoDate: formatISO(inputAsDate),
      localeDate: inputAsDate.toLocaleString(),
      differenceFromNow: formatDistance(inputAsDate, now, {
        addSuffix: true,
        includeSeconds: true,
      }),
    }
  }
}
