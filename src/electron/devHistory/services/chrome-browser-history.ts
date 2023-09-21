import sqlite3 from 'sqlite3'
import fs from 'fs'
import util from 'util'
import path from 'path'
import { app } from 'electron'
import {
  convertDateToMicrosecondsSinceWindowsEpoch,
  convertMicrosecondsToDate,
} from './time-wrangler'
import { ChromeHistoryEntry } from '../models/ChromeHistoryEntry'

export type SupportedOS = 'linux' | 'win32' | 'darwin'
function getChromeHistoryDatabasePath(os: SupportedOS) {
  let historyDBPath = ''
  // also check for /Profile 1/History in the various directories
  // maybe ask the user to select the profile directory in the future?
  switch (os) {
    case 'linux':
      // Typical path for Linux
      historyDBPath = `${process.env.HOME}/.config/google-chrome/Default/History`
      break
    case 'win32':
      // Typical path for Windows
      historyDBPath = `C:/Users/${process.env.USERNAME}/AppData/Local/Google/Chrome/User Data/Default/History`
      break
    case 'darwin':
      // Typical path for macOS (Darwin)
      historyDBPath = `${process.env.HOME}/Library/Application Support/Google/Chrome/Default/History`
      break
    default:
      console.error('Unsupported operating system:', os)
  }

  return historyDBPath
}

export async function readChromeHistory({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): Promise<ChromeHistoryEntry[]> {
  // Chrome history database path (update this path to match your system)
  const historyDBPath = getChromeHistoryDatabasePath(
    process.platform as SupportedOS,
  )

  const startTimestamp = convertDateToMicrosecondsSinceWindowsEpoch(startDate)
  const endTimestamp = convertDateToMicrosecondsSinceWindowsEpoch(endDate)
  console.log('opening chrome history database', historyDBPath)
  console.log('filesize', await getFileSizeInMB(historyDBPath))

  const electronAppTempPath = path.join(
    app.getPath('userData'),
    'chromeHistory.sqlite',
  )
  await copyFileAsync(historyDBPath, electronAppTempPath)
  console.log('copied file to', electronAppTempPath)
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
          const formattedHistory = rows.map(row => ({
            url: row.url,
            title: row.title,
            visitTime: convertMicrosecondsToDate(row.last_visit_time),
          }))
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

async function getFileSizeInMB(filePath: string): Promise<number | null> {
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
