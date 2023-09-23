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

export interface IncrementAnalysis {
  increment: DateRange
  summary: string | undefined
  raw: {
    events: HistoryEntry[]
    analysis: IncrementGPTResponse | undefined
  }
}
export async function analyseDay(date: Date) {
  const settings = await UserSettingsService.getSettings()
  if (!settings.openAiChatGptKey) {
    throw new Error('no openApiChatGptKey')
  }
  await copyLatestChromeHistory()
  const increments = calculateIncrements(getStartAndEndOfDay(date))

  const gptPromises = increments.map(async increment => {
    const chromeEventsForPeriod = await readChromeHistory(increment)
    const gitEventsForPeriod = await readGitHistory(increment)

    const eventsForPeriod = [
      ...chromeEventsForPeriod,
      ...gitEventsForPeriod,
    ].sort((a, b) => {
      return a.date.getTime() - b.date.getTime()
    })
    console.log()
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

  // open ai api limits?
  console.log(`starting ${gptPromises.length} gptPromises`)
  const chatResults = await Promise.allSettled(gptPromises)
  console.log(`gptPromises complete`)

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

  return results
}
