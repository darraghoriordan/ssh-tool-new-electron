import path from 'path'
import fs from 'fs'
import fsp from 'fs/promises'
import { IncrementAnalysis } from './day-analyser'
import { app } from 'electron'

export async function getFromCache(
  startDate: Date,
): Promise<IncrementAnalysis[] | undefined> {
  const cachePath = await getCachePath(startDate)
  if (!fs.existsSync(cachePath)) {
    return undefined
  }
  const fileUtf8 = await fsp.readFile(cachePath, { encoding: 'utf-8' })
  const cache = JSON.parse(fileUtf8)

  return cache
}

export async function saveToCache(
  startDate: Date,
  analysis: IncrementAnalysis[],
): Promise<void> {
  const cachePath = await getCachePath(startDate)
  await fsp.writeFile(cachePath, JSON.stringify(analysis))
}

async function getCachePath(startDate: Date): Promise<string> {
  const cachePath = path.join(
    app.getPath('userData'),
    'dev-history-cache',
    `${startDate.toISOString()}.json`,
  )
  return cachePath
}
