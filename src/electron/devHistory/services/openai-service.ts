/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'
import { ChatMessage } from '../../openai/ChatMessage'
import { HistoryEntry } from '../models/HistoryEntry'
import { encode } from 'gpt-3-encoder'
import z from 'zod'

export const IncrementGPTResponseSchema = z.object({
  tokensUsed: z.number(),
  errorMessage: z.string().optional(),
  finishReason: z.string().optional(),
  summary: z
    .object({
      text: z.string(),
      category: z.string(),
    })
    .or(z.undefined()),
})
export type IncrementGPTResponse = z.infer<typeof IncrementGPTResponseSchema>

export async function runChatCompletion(
  request: {
    historyItems: HistoryEntry[]
  },
  options: { openAIApiKey: string },
): Promise<IncrementGPTResponse> {
  const openai = new OpenAI({
    apiKey: options.openAIApiKey,
  })
  try {
    const browserHistoryItems = request.historyItems
      .filter(x => x.type === 'browser history')
      .map(x => x.metadata)

    if (browserHistoryItems.length > 0) {
      return await runBrowserHistoryCompletion(browserHistoryItems, openai)
    }

    return {
      tokensUsed: 0,
      summary: undefined,
      finishReason: undefined,
      errorMessage: 'No handler to run for the provided history items',
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
      summary: undefined,
      finishReason,
      errorMessage,
    }
  }
}

async function runBrowserHistoryCompletion(
  browserHistoryItems: any,
  openai: OpenAI,
): Promise<IncrementGPTResponse> {
  const chatMessages: ChatMessage[] = [
    {
      role: 'user',
      content: `Browsing History Session: ${JSON.stringify(browserHistoryItems)}
  
          I want to summarise the browser history session into one paragraph.
  
    You will generate a concise, entity-dense summary of the overall session. The summary should cover all items, do not write a summary for individual items.
  
  Guidelines:
          
  - The summary should be 2-3 sentences, ~25 words, highly specific and information dense. Do not use filler if it takes up words from information.
  - Only return the summary, do not explain
  - do not use subjects like "The user's browsing session...", instead use "A browsing session..."`,
    },
  ]
  const model = selectBestModel(chatMessages)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })

  const extractedSummary = completion.choices[0].message.content

  if (!extractedSummary) {
    throw new Error(
      `No summary generated for ${JSON.stringify(browserHistoryItems)}`,
    )
  }

  chatMessages.push({
    role: 'assistant',
    content: extractedSummary,
  })
  chatMessages.push({
    role: 'user',
    content: `categorise that summary into one of the following: "software-development", "marketing", "sales", "other", "personal". 
    Guidelines:
      - only return the category, do not explain
      - if the summary is not about any of these categories, return "other"
      - if the summary is about multiple categories, return the most relevant category
      - use lower case and hyphens for the category name`,
  })
  const categoryCompletion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })
  const extractedCategory = categoryCompletion.choices[0].message.content

  return {
    tokensUsed: categoryCompletion.usage?.total_tokens || 0,
    finishReason: completion.choices[0].finish_reason,
    summary: { text: extractedSummary, category: extractedCategory || 'other' },
  }
}

function selectBestModel(chatMessages: ChatMessage[]) {
  let model = 'gpt-3.5-turbo'
  const length = encode(chatMessages[0].content).length
  if (length > 16000) {
    throw new Error(
      'Too many tokens! Too much happened during this period for the LLM to make sense of it.',
    )
  }
  if (length > 4000) {
    model = 'gpt-3.5-turbo-16k'
  }
  console.log('using gpt model', model)
  return model
}
