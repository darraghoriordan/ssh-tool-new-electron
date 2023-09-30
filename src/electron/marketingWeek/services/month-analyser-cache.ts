import path from 'path'
import fs from 'fs'
import fsp from 'fs/promises'
import { app } from 'electron'

export async function getFromCache(
  start: number,
  end: number,
): Promise<Map<number, boolean> | undefined> {
  const cachePath = await getCachePath(start, end)

  if (!fs.existsSync(cachePath)) {
    console.log(`Cache file not found for ${start}-${end}`)
    return undefined
  }
  const fileUtf8 = await fsp.readFile(cachePath, { encoding: 'utf-8' })

  const cache: [number, boolean][] = JSON.parse(fileUtf8)

  // Create a new map and populate it with the parsed key-value pairs
  const numberBooleanMap = new Map<number, boolean>(cache)

  return numberBooleanMap
}

export async function saveToCache(
  start: number,
  end: number,
  activity: Map<number, boolean>,
): Promise<void> {
  const cachePath = await getCachePath(start, end)
  console.log('saving to cache', cachePath)
  if (!fs.existsSync(path.dirname(cachePath))) {
    await fsp.mkdir(path.dirname(cachePath), { recursive: true })
  }
  const jsonString = JSON.stringify(Array.from(activity.entries()))

  await fsp.writeFile(cachePath, jsonString)
}

async function getCachePath(start: number, end: number): Promise<string> {
  const cachePath = path.join(
    app.getPath('userData'),
    'month-git-activity-cache',
    `${start}-${end}.json`,
  )
  return cachePath
}
