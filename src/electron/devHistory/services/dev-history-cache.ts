import path from 'path'
import fs from 'fs'
import fsp from 'fs/promises'
import { CacheFileSchema, IncrementAnalysis } from '../models/IncrementAnalysis'
import { app } from 'electron'

export async function getFromCache(
  startDate: Date,
): Promise<IncrementAnalysis[] | undefined> {
  const cachePath = await getCachePath(startDate)

  if (!fs.existsSync(cachePath)) {
    console.log(`Cache file not found for ${startDate}`)
    return undefined
  }
  const fileUtf8 = await fsp.readFile(cachePath, { encoding: 'utf-8' })
  const cache = JSON.parse(fileUtf8)
  const validated = CacheFileSchema.parse(cache)
  return validated
}

export async function saveToCache(
  startDate: Date,
  analysis: IncrementAnalysis[],
): Promise<void> {
  const cachePath = await getCachePath(startDate)
  console.log('saving to cache', cachePath)
  if (!fs.existsSync(path.dirname(cachePath))) {
    await fsp.mkdir(path.dirname(cachePath), { recursive: true })
  }
  const now = new Date()
  // only save items that are not in the future
  analysis = analysis.filter(a => a.increment.endDate <= now)

  console.log(`saving filtered ${analysis.length} to cache`)
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
