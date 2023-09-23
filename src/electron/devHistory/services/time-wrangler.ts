export function getStartAndEndOfDay(date: Date = new Date()): DateRange {
  // Clone the input date to avoid modifying it
  const inputDate = new Date(date)

  // Set the time to the start of the day (midnight)
  inputDate.setHours(0, 0, 0, 0)

  // if the day is today, use the current time as the endTime
  const now = new Date()
  if (inputDate.toDateString() === now.toDateString()) {
    return { startDate: inputDate, endDate: now }
  }
  // Create a new Date object for the end of the day
  const endDate = new Date(inputDate)
  endDate.setHours(23, 59, 59, 999)

  return { startDate: inputDate, endDate }
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

export interface DateRange {
  startDate: Date
  endDate: Date
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
