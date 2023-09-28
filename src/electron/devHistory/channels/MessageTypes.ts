import { IncrementAnalysis } from '../models/IncrementAnalysis'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DevHistoryGetDayRequest = {
  date: Date
}

export type DevHistoryDayResponse = {
  analysis: IncrementAnalysis[]
}

export type GitActivityForMonthRequest = {
  startDate: Date
  endDate: Date
}
export type GitActivityForMonthResponse = {
  activity: Map<number, boolean>
}
