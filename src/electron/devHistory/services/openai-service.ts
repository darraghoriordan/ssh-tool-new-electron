/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'
import { ChatMessage } from '../../openai/ChatMessage'
import { HistoryEntry } from '../models/HistoryEntry'
import { encode } from 'gpt-3-encoder'

export interface IncrementGPTResponse {
  tokensUsed: number
  errorMessage?: string
  finishReason?: string
  summary: { Missing_Entities: string[]; Denser_Summary: string }[]
  //   activities: {
  //     startOfPeriod: Date
  //     endOfPeriod: Date
  //     summary: string
  //     details: string[]
  //   }[]
}

export async function runChatCompletion(
  request: {
    historyItems: HistoryEntry[]
  },
  options: { openAIApiKey: string },
): Promise<IncrementGPTResponse> {
  const openai = new OpenAI({
    apiKey: options.openAIApiKey,
  })
  // can only send 200 history entries at a time
  try {
    const chatMessages: ChatMessage[] = [
      {
        role: 'user',
        content: `Events: ${JSON.stringify(request.historyItems)}

        You will generate increasingly concise, entity-dense summaries of the combined array of events above. A summary will concisely describe what the user was trying to achieve by triggering these events.

        Repeat the following 3 steps 5 times. 
        
        Step 1. Identify 1-3 informative entities (";" delimited) from the events metadata which are missing from the previously generated summary. 
        Step 2. Write a new, denser summary of identical length which covers every entity and detail from the previous summary plus the missing entities.
        Step 3. Categorise the summary into one of the following enum values: "personal", "software-development", "sales","marketing","other".
        
        A missing entity is:
        - relevant to the main story, 
        - specific yet concise (5 words or fewer), 
        - novel (not in the previous summary), 
        - faithful (present in the events), 
        - anywhere (can be located anywhere in the events).
        
        Guidelines:
        
        - Ignore the times except for ordering and context
        - The first summary should be 1-2 sentences, ~10 words, yet highly non-specific, containing little information beyond the entities marked as missing. Use overly verbose language and fillers (e.g., "User tried to") to reach ~10 words.
        - Make every word count: rewrite the previous summary to improve flow and make space for additional entities.
        - Make space with fusion, compression, and removal of uninformative phrases like "User searched for" or "User inquired about".
        - The summaries should become highly dense and concise yet self-contained, i.e., easily understood without the events themselves. 
        - Missing entities can appear anywhere in the new summary.
        - Never drop entities from the previous summary. If space cannot be made, add fewer new entities.
        - the categories must be spelled exactly as described here: "personal", "software-development", "sales","marketing", "other". do not change the spelling of categories in any way.
        
        Remember, use the exact same number of words for each summary.
        Answer in JSON. The JSON should be a list (length 5) of dictionaries whose keys are "Missing_Entities","Denser_Summary" and "Category". e.g.
        [{
        "Missing_Entities": "JavaScript;day;current locale",
        "Denser_Summary": "Searched for JavaScript day start.",
        "Category": software-development
        },{
        "Missing_Entities": "JavaScript;7am;current timezone.",
        "Denser_Summary": "Searched for JavaScript 7am.",
        "Category": software-development
        }]`,
      },
    ]
    const model = selectBestModel(chatMessages)

    const completion = await openai.chat.completions.create({
      model: model,
      messages: chatMessages,
    })

    const extractedText = JSON.parse(
      completion.choices[0].message?.content || '[]',
    ) as { Missing_Entities: string[]; Denser_Summary: string }[]
    if (extractedText === undefined) {
      throw new Error('Could not extract text from completion')
    }
    console.log('extractedText', extractedText)
    return {
      tokensUsed: completion.usage?.total_tokens || 0,
      finishReason: completion.choices[0].finish_reason,
      summary: extractedText,
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
      summary: [],
      finishReason,
      errorMessage,
    }
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
