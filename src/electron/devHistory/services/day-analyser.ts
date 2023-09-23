import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
import { HistoryEntry } from '../models/HistoryEntry'
import {
  copyLatestChromeHistory,
  readChromeHistory,
} from './chrome-browser-history'
import { readGitHistory } from './git-repository-history'
import { notEmpty } from './notEmpty'
import { IncrementGPTResponse, runChatCompletion } from './openai-service'
import {
  DateRange,
  calculateIncrements,
  getStartAndEndOfDay,
} from './time-wrangler'
import { getFromCache, saveToCache } from './dev-history-cache'

export interface IncrementAnalysis {
  increment: DateRange
  summary: string | undefined
  raw: {
    events: HistoryEntry[]
    analysis: IncrementGPTResponse | undefined
  }
}

export async function analyseDay(date: Date) {
  const dayRange = getStartAndEndOfDay(date)
  // check if we have a cached version of this day
  const cachedDayAnalysis = await getFromCache(dayRange.startDate)
  const increments = calculateIncrements(dayRange)
  // if the cached analysis has every increment by end, return it
  if (
    cachedDayAnalysis &&
    cachedDayAnalysis.length === increments.length &&
    cachedDayAnalysis.every(
      a =>
        a.increment.endDate.getTime() ===
        increments
          .find(i => i.endDate === a.increment.endDate)
          ?.endDate?.getTime(),
    )
  ) {
    return cachedDayAnalysis
  }
  const settings = await UserSettingsService.getSettings()
  if (!settings.openAiChatGptKey) {
    throw new Error('no openApiChatGptKey')
  }
  await copyLatestChromeHistory()

  // create a promise for each increment that does all the work
  const gptPromises = increments.map(async increment => {
    // check if we have a cached version of this increment
    const cachedItem = cachedDayAnalysis?.find(
      a =>
        a.increment.startDate === increment.startDate &&
        a.increment.endDate === increment.endDate,
    )
    if (cachedItem) {
      console.log(`using cached analysis for ${increment.startDate}`)
      return cachedItem
    }

    // otherwise get any data we need
    const chromeEventsForPeriod = await readChromeHistory(increment)
    const gitEventsForPeriod = await readGitHistory(increment)

    const eventsForPeriod = [
      ...chromeEventsForPeriod,
      ...gitEventsForPeriod,
    ].sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })

    if (eventsForPeriod.length === 0) {
      return {
        increment: increment,
        summary: undefined,
        raw: {
          events: eventsForPeriod,
          analysis: undefined,
        },
      }
    }
    const chatResult = await runChatCompletion(
      {
        historyItems: eventsForPeriod,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        openAIApiKey: settings.openAiChatGptKey!,
      },
    )
    return {
      increment: increment,
      summary: chatResult.summary[3].Denser_Summary,
      raw: {
        events: eventsForPeriod,
        analysis: chatResult,
      },
    }
  })

  console.log(`starting ${gptPromises.length} gptPromises`)
  const chatResults = await Promise.allSettled(gptPromises)
  console.log(`gptPromises complete`)

  // filter out any errors and empty results
  const results = chatResults
    .map(result => {
      return result.status === 'fulfilled' ? result.value : undefined
    })
    .filter(notEmpty)
    .sort((a, b) => {
      return (
        (a?.increment?.startDate?.getTime() || 0) -
        (b?.increment?.startDate?.getTime() || 0)
      )
    })

  // save to cache
  await saveToCache(dayRange.startDate, results)

  return results
}
