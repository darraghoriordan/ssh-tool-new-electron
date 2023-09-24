import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
import {
  copyLatestChromeHistory,
  readChromeHistory,
} from './chrome-browser-history'
import { readGitHistory } from './git-repository-history'
import { notEmpty } from './notEmpty'
import { runChatCompletion } from './openai-service'
import {
  calculateIncrements,
  getStartAndEndOfDay,
  timeOfDayMatchesToSecond,
} from './time-wrangler'
import { getFromCache, saveToCache } from './dev-history-cache'

export async function analyseDay(date: Date) {
  // make sure we have the openAi key
  const settings = await UserSettingsService.getSettings()
  if (!settings.openAiChatGptKey) {
    throw new Error('no openApiChatGptKey')
  }

  console.log('analysing day', date)
  // gets the local start and end of day in utc
  const dayRange = getStartAndEndOfDay(
    {
      day: date.getDate(),
      monthIndex: date.getMonth(),
      year: date.getFullYear(),
    },
    new Date(),
  )
  console.log('using dayRange', dayRange)
  // check if we have a cached version of this day
  const cachedDayAnalysis = await getFromCache(dayRange.startDate)
  const increments = calculateIncrements(dayRange)
  // if the cached analysis has every increment by end, return it
  if (cachedDayAnalysis && cachedDayAnalysis.length === increments.length) {
    return cachedDayAnalysis
  }
  console.log(`Cached analysis not complete for ${dayRange.startDate}`, {
    dayRange,
    cachedIncrementsLength: cachedDayAnalysis?.length,
    incrementCount: increments.length,
    lastCachedIncrement: cachedDayAnalysis?.[cachedDayAnalysis.length - 1],
  })

  // we have to copy the chrome history sqlite file so that we can read it even if it
  // is locked by chrome. This might not work for multi instances of getting a day history in parallel
  await copyLatestChromeHistory()

  // create a promise for each increment that does all the work
  // these will start running right away
  const gptPromises = increments.map(async increment => {
    // check if we have a cached version of this increment
    const cachedItem = cachedDayAnalysis?.find(a =>
      timeOfDayMatchesToSecond(a.increment.endDate, increment.endDate),
    )

    if (cachedItem) {
      console.log(
        `using cached analysis for ${increment.startDate} to ${increment.endDate}`,
        cachedItem,
      )
      return cachedItem
    }

    // otherwise get any data we need
    const chromeEventsForPeriod = await readChromeHistory(increment)
    const gitEventsForPeriod = await readGitHistory(increment)

    // concat and sort all events together
    const eventsForPeriod = [
      ...chromeEventsForPeriod,
      ...gitEventsForPeriod,
    ].sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })

    // exit early if there is no work to do
    if (eventsForPeriod.length === 0) {
      console.log(
        `cached analysis not found for ${increment.startDate}. 0 events so exiting early.`,
      )
      return {
        increment: increment,
        summary: undefined,
        raw: {
          events: eventsForPeriod,
          analysis: undefined,
        },
      }
    }

    console.log(
      `cached analysis not found for ${increment.startDate}. Generating from ${eventsForPeriod.length} events`,
    )
    // run the gpt analysis
    const chatResult = await runChatCompletion(
      {
        historyItems: eventsForPeriod,
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        openAIApiKey: settings.openAiChatGptKey!,
      },
    )
    // probably this is where a record should be written to sqlite rather than the files i use
    return {
      increment: increment,
      summary: chatResult.summary?.text,
      raw: {
        events: eventsForPeriod,
        analysis: chatResult,
      },
    }
  })

  console.log(`awaiting ${gptPromises.length} gptPromises`)
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
