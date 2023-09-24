import z from 'zod'

export const DateRangeSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})
export type DateRange = z.infer<typeof DateRangeSchema>

export function getStartAndEndOfDay(
  localDate: {
    day: number
    monthIndex: number
    year: number
  },
  now: Date, // passing this in is easier for testing
): DateRange {
  // create a new date object for the input date
  const inputDate = new Date(
    localDate.year,
    localDate.monthIndex,
    localDate.day,
  )

  // Set the time to the start of the day (midnight)
  inputDate.setHours(0, 0, 0, 0)

  // if the day is today, use the current time as the endTime
  if (inputDate.toDateString() === now.toDateString()) {
    return { startDate: inputDate, endDate: now }
  }
  // Create a new Date object for the end of the day
  const endDate = new Date(inputDate)
  endDate.setHours(23, 59, 59, 999)

  return { startDate: inputDate, endDate }
}

export function isLastPossibleTimeOfDay(endDate: Date): boolean {
  return (
    endDate.getHours() === 23 &&
    endDate.getMinutes() === 59 &&
    endDate.getSeconds() === 59 &&
    endDate.getMilliseconds() === 999
  )
}

export function timeOfDayMatchesToSecond(date1: Date, date2: Date): boolean {
  // json can't handle dates, so we convert them from the strings
  if (typeof date1 === 'string') {
    date1 = new Date(date1)
  }
  return (
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes() &&
    date1.getSeconds() === date2.getSeconds()
  )
}

const MICROSECONDS_PER_SECOND = 1e6
const MICROSECONDS_BETWEEN_EPOCHS = 11644473600 * MICROSECONDS_PER_SECOND
export function convertMicrosecondsToDate(microseconds: number): Date {
  // Calculate the Unix timestamp in microseconds
  const unixTimestampInMicroseconds = microseconds - MICROSECONDS_BETWEEN_EPOCHS

  // Convert microseconds to milliseconds (divide by 1000) and create a JavaScript Date
  const milliseconds = unixTimestampInMicroseconds / 1000
  const date = new Date(milliseconds)

  return date
}

export function convertDateToMicrosecondsSinceWindowsEpoch(date: Date): number {
  // Calculate the difference in microseconds between the provided date and the Windows epoch
  const unixTimestampInMilliseconds = date.getTime()
  const microsecondsSinceWindowsEpoch =
    unixTimestampInMilliseconds * 1000 + MICROSECONDS_BETWEEN_EPOCHS

  return microsecondsSinceWindowsEpoch
}

export function calculateIncrements(dateRange: DateRange): DateRange[] {
  const { startDate, endDate } = dateRange
  const increments: DateRange[] = []
  let currentIncrement = new Date(startDate)

  while (currentIncrement < endDate) {
    // Calculate the end time for this increment
    const nextIncrement = new Date(currentIncrement)
    nextIncrement.setMinutes(currentIncrement.getMinutes() + 30)

    // Check if the next increment exceeds the end date
    if (nextIncrement > endDate) {
      // Calculate the remaining time and extend the last increment
      const extendedIncrement = new Date(currentIncrement)
      extendedIncrement.setMinutes(
        currentIncrement.getMinutes() +
          Math.ceil((endDate.getTime() - currentIncrement.getTime()) / 60000),
      )

      increments.push({
        startDate: currentIncrement,
        endDate: extendedIncrement,
      })
      break
    }

    // Add the 30-minute increment to the list
    increments.push({ startDate: currentIncrement, endDate: nextIncrement })

    // Move to the next 30-minute interval
    currentIncrement = nextIncrement
  }

  return increments
}
