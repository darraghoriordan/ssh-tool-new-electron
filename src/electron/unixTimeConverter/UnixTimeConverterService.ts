import { UnixTimeConverterResponse } from './channels/MessageTypes'
import { formatDistance, formatISO } from 'date-fns'

export class UnixTimeConverter {
  static convert(input: string, now: Date): UnixTimeConverterResponse {
    const milliSeconds = parseInt(input, 10) * 1000
    const utcDate = new Date(milliSeconds)

    // the difference between two dates as an english sentence

    // const diffYears = differenceInYears(now, utcDate);
    // const diffMonths = differenceInMonths(now, utcDate)
    return {
      utcDate: utcDate.toISOString(),
      isoDate: formatISO(utcDate),
      localeDate: utcDate.toLocaleString(),
      differenceFromNow: formatDistance(utcDate, now, {
        addSuffix: true,
        includeSeconds: true,
      }),
    }
  }
}
