import { ChromeHistoryEntry } from '../models/ChromeHistoryEntry'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type DevHistoryGetDayRequest = {
  date: Date
}

export type DevHistoryDayResponse = {
  chromeHistory: ChromeHistoryEntry[]
}
