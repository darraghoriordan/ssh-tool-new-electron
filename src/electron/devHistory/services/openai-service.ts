/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'
import { ChatMessage } from '../../openai/ChatMessage'
import { ChromeHistoryEntry } from '../models/ChromeHistoryEntry'

export interface DayAnalysis {
  day: Date
  tokensUsed: number
  errorMessage?: string
  finishReason?: string
  activities: {
    startOfPeriod: Date
    endOfPeriod: Date
    summary: string
    details: string[]
  }[]
}

export async function runChatCompletion(
  request: {
    day: Date
    chromeHistory: ChromeHistoryEntry[]
  },
  options: { openAIApiKey: string },
): Promise<DayAnalysis> {
  const openai = new OpenAI({
    apiKey: options.openAIApiKey,
  })
  // can only send 200 history entries at a time
  try {
    const chatMessages: ChatMessage[] = [
      {
        role: 'user',
        content: `Day: ${JSON.stringify(request.chromeHistory)}
        
        First, split the provided data into 30 minute blocks.
        For each block, generate concise, dense summaries of all the items in that block. The summary should be 1 or 2 sentences.
        Finally, categorize the activities into these categories: development, work, personal, and other. development is anything that is related to coding.
       
        The output should be in JSON format. e.g. 
        [{startOfPeriod: 2023-09-21T12:00:00, endOfPeriod: 2023-09-21T12:30:00, summary: "Worked on organisations api, added manager controller.", category: "development"}
        ,{startOfPeriod: 2023-09-21T17:30:00, endOfPeriod: 2023-09-21T18:00:00, summary: "Browsed @someuser and others on twitter", category: "personal"}]`,
      },
    ]
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      messages: chatMessages,
    })

    const extractedText = completion.choices[0].message?.content
    if (extractedText === undefined) {
      throw new Error('Could not extract text from completion')
    }
    console.log('extractedText', extractedText)
    return {
      tokensUsed: completion.usage?.total_tokens || 0,
      finishReason: completion.choices[0].finish_reason,
      activities: [],
      day: request.day,
    }
  } catch (error) {
    // try not to throw from here. makes the path easier to follow in callers
    // the http library will throw on 400s from cat gpt but these are handlable errors
    const finishReason = (error as any)?.data?.choices?.[0]?.finish_reason
    const tokensUsed = (error as any)?.data?.usage?.total_tokens || 0
    let errorMessage = (error as Error).message
    if (errorMessage.includes('400')) {
      errorMessage = `${errorMessage}: This usually means that we have exceeded the maximum number of tokens for the api. Or your api key is invalid.`
    }
    return {
      tokensUsed: tokensUsed,
      activities: [],
      day: request.day,
      finishReason,
      errorMessage,
    }
  }
}
