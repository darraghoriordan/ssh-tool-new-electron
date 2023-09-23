import { IncrementAnalysis } from '../services/day-analyser'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DevHistoryGetDayRequest = {
  date: Date
}

export type DevHistoryDayResponse = {
  analysis: IncrementAnalysis[]
}
