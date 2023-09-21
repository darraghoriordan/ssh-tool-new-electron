export function getStartAndEndOfDay(date: Date): {
  startDate: Date
  endDate: Date
} {
  // Clone the input date to avoid modifying it
  const inputDate = new Date(date)

  // Set the time to the start of the day (midnight)
  inputDate.setHours(0, 0, 0, 0)

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
