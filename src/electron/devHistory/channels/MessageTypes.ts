import { BrowserHistoryEntry } from '../models/HistoryEntry'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DevHistoryGetDayRequest = {
  date: Date
}

export type DevHistoryDayResponse = {
  chromeHistory: BrowserHistoryEntry[]
}
