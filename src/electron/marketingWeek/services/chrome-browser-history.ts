import sqlite3 from 'sqlite3'
import fs from 'fs'
import util from 'util'
import path from 'path'
import { app } from 'electron'
import {
  convertDateToMicrosecondsSinceWindowsEpoch,
  convertMicrosecondsToDate,
} from './time-wrangler'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
import { BrowserHistoryEntry } from '../models/HistoryEntry'

export const electronAppTempPath = path.join(
  app.getPath('userData'),
  'chromeHistory.sqlite',
)
export async function copyLatestChromeHistory(): Promise<void> {
  const userSettings = await UserSettingsService.getSettings()
  // Chrome history database path (update this path to match your system)
  const historyDBPath = userSettings.chromeHistoryPath

  if (!historyDBPath) {
    throw new Error(
      'Chrome history database path not found. Please set the path in the settings.',
    )
  }

  await copyFileAsync(historyDBPath, electronAppTempPath)
}

export async function readChromeHistory({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): Promise<BrowserHistoryEntry[]> {
  const startTimestamp = convertDateToMicrosecondsSinceWindowsEpoch(startDate)
  const endTimestamp = convertDateToMicrosecondsSinceWindowsEpoch(endDate)

  const db = new sqlite3.Database(electronAppTempPath, sqlite3.OPEN_READONLY)

  const query = `
    SELECT url, title, last_visit_time
    FROM urls
    WHERE last_visit_time BETWEEN ? AND ?
  `

  return new Promise((resolve, reject) => {
    db.all<{ url: string; title: string; last_visit_time: number }>(
      query,
      [startTimestamp, endTimestamp],
      (err, rows) => {
        if (err) {
          console.error('Error accessing Chrome history database:', err.message)
          reject(err)
        } else {
          const formattedHistory = rows.map(mapToBrowserHistoryEvent)
          resolve(formattedHistory)
        }
        db.close(err => {
          if (err) {
            console.error('Error closing the database:', err.message)
          }
        })
      },
    )
  })
}

function mapToBrowserHistoryEvent(row: {
  url: string
  title: string
  last_visit_time: number
}): BrowserHistoryEntry {
  return {
    type: 'browser history',
    date: convertMicrosecondsToDate(row.last_visit_time),
    metadata: {
      url: row.url,
      title: row.title,
    },
  }
}

export async function getFileSizeInMB(
  filePath: string,
): Promise<number | null> {
  try {
    // Get the file stats (including size) asynchronously
    const stats = await fs.promises.stat(filePath)

    // Calculate the size in megabytes (MB)
    const fileSizeInMB = stats.size / (1024 * 1024) // 1 MB = 1024 KB, 1 KB = 1024 bytes

    return fileSizeInMB
  } catch (error) {
    // Handle file not found or other errors
    console.error('Error getting file size:', error)
    return null
  }
}

const copyFile = util.promisify(fs.copyFile)

async function copyFileAsync(
  sourcePath: string,
  destinationPath: string,
): Promise<void> {
  try {
    // Use the promisified copyFile method to copy the file asynchronously
    await copyFile(sourcePath, destinationPath)
    console.log(`File copied from ${sourcePath} to ${destinationPath}`)
  } catch (error) {
    console.error('Error copying file:', error)
    throw error // Re-throw the error to handle it at the calling code level if needed
  }
}
