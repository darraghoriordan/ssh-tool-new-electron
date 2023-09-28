/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from 'openai'
import { ChatMessage } from '../../openai/ChatMessage'
import {
  BrowserHistoryEntry,
  GitCommitHistoryEntry,
  HistoryEntry,
} from '../models/HistoryEntry'
import { encode } from 'gpt-3-encoder'
import z from 'zod'

const CategoryEnumSchema = z.enum([
  'software-development',
  'marketing',
  'sales',
  'other',
  'personal',
])
export type CategoryEnum = z.infer<typeof CategoryEnumSchema>

export const IncrementGPTResponseSchema = z.object({
  tokensUsed: z.number(),
  errorMessage: z.string().optional(),
  finishReason: z.string().optional(),
  tweets: z.array(
    z.object({
      text: z.string(),
    }),
  ),
  blogPosts: z.array(
    z.object({
      text: z.string(),
    }),
  ),
  summary: z
    .object({
      text: z.string(),
      category: CategoryEnumSchema,
    })
    .or(z.undefined()),
})
export type IncrementGPTResponse = z.infer<typeof IncrementGPTResponseSchema>

export const SocialMediaGptResponseSchema = z.object({
  tokensUsed: z.number(),
  errorMessage: z.string().optional(),
  finishReason: z.string().optional(),
  tweets: z.array(
    z.object({
      text: z.string(),
    }),
  ),
  blogPosts: z.array(
    z.object({
      text: z.string(),
    }),
  ),
})
export type SocialMediaGptResponse = z.infer<
  typeof SocialMediaGptResponseSchema
>

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
      .map(x => x.metadata) as unknown as BrowserHistoryEntry[]

    const completedSummaries = []
    if (browserHistoryItems.length > 0) {
      completedSummaries.push(
        runBrowserHistoryCompletion(browserHistoryItems, openai),
      )
    }
    const codeHistoryItems = request.historyItems
      .filter(x => x.type === 'git commit')
      .map(x => x.metadata) as unknown as GitCommitHistoryEntry[]

    if (codeHistoryItems.length > 0) {
      const codeDiffCompletion = runCodeDiffCompletion(codeHistoryItems, openai)

      completedSummaries.push(codeDiffCompletion)
    }
    const allSummaries = await Promise.all(completedSummaries)
    if (allSummaries.length === 1) {
      return allSummaries[0]
    }

    const summaryCompletion = await runCombinationSummaryCompletion(
      allSummaries,
      openai,
    )
    // kinda lying about tokens used here
    return summaryCompletion
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
      tweets: [],
      blogPosts: [],
      finishReason,
      errorMessage,
    }
  }
}

async function runCombinationSummaryCompletion(
  responses: IncrementGPTResponse[],
  openai: OpenAI,
): Promise<IncrementGPTResponse> {
  if (responses.length === 1) {
    return responses[0]
  }
  if (responses.length <= 0) {
    throw new Error('No responses to combine')
  }
  const chatMessages: ChatMessage[] = [
    {
      role: 'user',
      content: `Summaries: ${JSON.stringify(
        responses.map(x => x.summary?.text).join('\n'),
      )}
      
      Given the provided activity reports, generate a 1-3 sentence summary that combines the reports without.
      
      You will generate a concise, entity-dense summary. The summary should condense all items into one paragraph, do not write individual summaries for individual items.
      
      Guidelines:

      - The summary should be 1-3 sentences, highly specific and information dense. Do not use filler if it takes up words from information.
      - Only return the summary, do not explain
      - don't mention the date or time period events occurred in your summary
      - Rewrite the summary to be coherent and flow well
     `,
    },
  ]
  const model = selectBestModel(chatMessages)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })

  const extractedSummary = completion.choices[0].message.content

  if (!extractedSummary) {
    throw new Error(`No summary generated`)
  }

  return {
    tokensUsed: completion.usage?.total_tokens || 0,
    finishReason: completion.choices[0].finish_reason,
    tweets: responses.flatMap(x => x.tweets),
    blogPosts: responses.flatMap(x => x.blogPosts),
    summary: { text: extractedSummary, category: 'software-development' },
  }
}

async function runCodeDiffCompletion(
  codeHistoryItems: GitCommitHistoryEntry[],
  openai: OpenAI,
): Promise<IncrementGPTResponse> {
  console.log('running code history completion')
  const chatMessages: ChatMessage[] = [
    {
      role: 'user',
      content: `Git commits for coding session: ${JSON.stringify(
        codeHistoryItems,
      )}
    
      Given the tasks completed above by a software engineer on their computer, you will write their report for a standup meeting. The standup is a very short meeting so be terse.

      The Standup meeting report format describes what was done and why.
      
      Guidelines:
       - only return the stand up meeting report
       - don't explain your answer
       - don't mention the date or time period events occurred in your summary e.g. don't say "In september I...."
       - don't prepend with "stand up report:" or a descriptor like that. just return the report.
       - be terse
       - make sure to talk about any git code diffs if they are provided, but don't mention this if there are no diffs provided to you`,
    },
  ]
  const model = selectBestModel(chatMessages)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })

  const extractedSummary = completion.choices[0].message.content

  if (!extractedSummary) {
    throw new Error(`No summary generated`)
  }

  const socialMediaCompletion = await runCodeSocialMediaPostsCompletion(
    codeHistoryItems,
    openai,
  )
  return {
    tokensUsed:
      (completion.usage?.total_tokens || 0) + socialMediaCompletion?.tokensUsed,
    finishReason: completion.choices[0].finish_reason,
    blogPosts: socialMediaCompletion.blogPosts,
    tweets: socialMediaCompletion.tweets,
    summary: { text: extractedSummary, category: 'software-development' },
  }
}

export async function runCodeSocialMediaPostsCompletion(
  historyItems: GitCommitHistoryEntry[],
  openai: OpenAI,
): Promise<SocialMediaGptResponse> {
  const chatMessages: ChatMessage[] = [
    {
      role: 'user',
      content: `Git Code changes: ${JSON.stringify(historyItems)}
    
      Given the code changes completed above by a software engineer on their computer, you will generate 3 tweets for a technical audience. 

Perform the following steps
1. Understand what each diff in the code was changing
2. identify tricky sections
3. write tweets about the code

examples of good topics for tweets:
 - the libraries, tools and frameworks used and how they helped
 - the benefit of overall change 
 - the number of lines added or removed if significant
 - the learnings from making the tricky changes if any
 - the power of software to help people
 - change is forward progress
 - the importance of testing if any
 - thanking everyone who helped (not just the author)
 - a question e.g. a question about anyone else who has done something similar
 - or a question about how to improve the code
 - or a question about how to improve the process

guidelines:
- do not explain your answer
 - you don't have to add properties for hashtags, just include them in the text
 - you don't have to suggest an image for the social media posts, just the text
 - output JSON only. Output an array of JSON objects with property "text" e.g. [
   {"text": "abc..."},
 {"text": "abc..."},
 {"text": "abc..."}
]`,
    },
  ]
  let model = selectBestModel(chatMessages)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })

  const tweets = JSON.parse(completion.choices[0].message.content || '[]') as {
    text: string
  }[]

  if (!tweets) {
    throw new Error(`No summary generated`)
  }
  chatMessages.push({
    role: 'assistant',
    content: completion.choices[0].message.content || 'No tweets generated',
  })

  chatMessages.push({
    role: 'user',
    content: `
    now write a long form blog post about the code changes. The audience is technical but it's ok to do some product marketing also. 

    - Write a compelling introduction
    - Talk about why the change was necessary but don't oversell it
    - describe details about the actual code change
    - Write a short conclusion
    
    Write a title and meta description that are optimized for google search SEO
    
    Output everything in markdown format`,
  })
  model = selectBestModel(chatMessages)
  const blogCompletion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })
  const extractedBlog =
    blogCompletion.choices[0].message.content || 'No blog post generated'

  return {
    tokensUsed: completion.usage?.total_tokens || 0,
    finishReason: completion.choices[0].finish_reason,
    tweets,
    blogPosts: [{ text: extractedBlog }],
  }
}

async function runBrowserHistoryCompletion(
  browserHistoryItems: BrowserHistoryEntry[],
  openai: OpenAI,
): Promise<IncrementGPTResponse> {
  const chatMessages: ChatMessage[] = [
    {
      role: 'user',
      content: `Browsing History Session: ${JSON.stringify(browserHistoryItems)}
  
      Given the tasks completed above by a team member on their computer, you will write their report for a standup meeting. The standup is a very short meeting so be terse.

      The Standup meeting report format describes what was done and why.
      
      Guidelines:
       - only return the stand up meeting report
       - don't explain your answer
       - don't mention the date or time period events occurred in your summary e.g. don't say "In september I...."
       - don't prepend with "stand up report:" or a descriptor like that. just return the report.
       - be terse`,
    },
  ]
  const model = selectBestModel(chatMessages)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })

  const extractedSummary = completion.choices[0].message.content

  if (!extractedSummary) {
    throw new Error(`No summary generated`)
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
  const result = {
    tokensUsed: categoryCompletion.usage?.total_tokens || 0,
    finishReason: completion.choices[0].finish_reason,
    tweets: [],
    blogPosts: [],
    summary: {
      text: extractedSummary,
      category: (extractedCategory || 'other') as CategoryEnum, // kinda hacky
    },
  } as IncrementGPTResponse

  if (extractedCategory !== 'other') {
    const socialMediaCompletion = await runBrowsingSocialMediaPostsCompletion(
      browserHistoryItems,
      openai,
    )
    result.tweets.push(...socialMediaCompletion.tweets)
    result.blogPosts.push(...socialMediaCompletion.blogPosts)
    result.tokensUsed += socialMediaCompletion.tokensUsed
  }
  return result
}

export async function runBrowsingSocialMediaPostsCompletion(
  historyItems: BrowserHistoryEntry[],
  openai: OpenAI,
): Promise<SocialMediaGptResponse> {
  const chatMessages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are an expert social media marketer. You have been asked to generate social media posts (tweets and blog posts) for a business.
    
    examples of good topics for tweets and blog posts:

  Industry Trends: Share your insights on the latest trends in your industry.
  Discuss how these trends might impact businesses and professionals.

  Professional Development: Offer tips for career growth and personal development.
  Recommend books, courses, or webinars that have helped you.
  
  Thought Leadership: Share your unique perspectives on industry challenges.
  Pose thought-provoking questions to spark discussions.

  Success Stories: Highlight your achievements and success stories.
  Showcase how you overcame obstacles to reach your goals.

  Company Culture: Feature your company's culture and values.
  Share employee testimonials or behind-the-scenes glimpses.

  Product/Service Updates: Announce new product launches or service improvements.
  Explain how these updates benefit customers or clients.

  Networking and Collaboration: Acknowledge and thank professional contacts.
  Share your experiences from recent networking events or collaborations.

  Diversity and Inclusion: Promote diversity and inclusion in the workplace.
  Share resources or initiatives that support these values.

  Tips and How-Tos: Offer practical tips and step-by-step guides related to your expertise.
  Help your audience solve common problems.

  Industry News: Share and comment on the latest news and developments in your field.
  Provide your perspective or analysis.

  Inspirational Quotes: Share motivational quotes that resonate with your audience.
  Add a personal comment to make it more relevant.

  Personal Achievements: Celebrate personal milestones and accomplishments.
  Offer gratitude to supporters and mentors.

  Work-Life Balance: Discuss strategies for maintaining a healthy work-life balance.
  Share personal experiences or insights.
  
  Mentorship and Leadership: Talk about the importance of mentorship and leadership.
  Share stories of mentors who influenced your career.
  
  Technology and Innovation: Discuss emerging technologies or innovations in your field.
  Predict how they might shape the future.

  Social Responsibility: Highlight your involvement in social or environmental causes.
  Encourage your network to support meaningful initiatives.

  Personal Growth: Share your journey of personal growth and self-improvement.
  Recommend resources that have helped you in this regard.

  Humor and Fun: Share lighthearted jokes or anecdotes related to your industry.
  Keep the tone positive and relatable.
  
  Customer Testimonials: Showcase positive feedback and testimonials from satisfied customers.
  Express gratitude for their trust and support.

  Ask for Input: Pose questions to your audience to encourage engagement.
  Seek opinions or advice on relevant topics.
    `,
    },
    {
      role: 'user',
      content: `Browsing history events: ${JSON.stringify(historyItems)}
      
        Given the browsing history above, you will generate 3 tweets for marketing purposes. 
  
  Perform the following steps:
  1. Infer what the user was doing from the complete browsing history
  2. Identify interesting angles for marketing tweets - learning, humour, shock, surprise, etc
  3. write engaging tweets

  guidelines:
  - do not explain your answer
   - you don't have to add properties for hashtags, just include them in the text
   - you don't have to suggest an image for the social media posts, just the text
   - output JSON only. Output an array of JSON objects with property "text" e.g. [
     {"text": "abc..."},
   {"text": "abc..."},
   {"text": "abc..."}
  ]`,
    },
  ]
  let model = selectBestModel(chatMessages)

  const completion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })

  const tweets = JSON.parse(completion.choices[0].message.content || '[]') as {
    text: string
  }[]

  if (!tweets) {
    throw new Error(`No summary generated`)
  }
  chatMessages.push({
    role: 'assistant',
    content: completion.choices[0].message.content || 'No tweets generated',
  })

  chatMessages.push({
    role: 'user',
    content: `
      now write a long form blog post about some aspect of the browsing history. Use the list of good topics for ideas.
      Choose between focusing on one topic or multiple topics. The audience is technical but it's ok to do some product marketing also.
  
      - Write a compelling introduction
      - Write the body of the blog post
      - Write a short conclusion
      
      Write a title and meta description that are optimized for google search SEO
      
      Output everything in markdown format`,
  })
  model = selectBestModel(chatMessages)
  const blogCompletion = await openai.chat.completions.create({
    model: model,
    messages: chatMessages,
  })
  const extractedBlog =
    blogCompletion.choices[0].message.content || 'No blog post generated'

  return {
    tokensUsed: completion.usage?.total_tokens || 0,
    finishReason: completion.choices[0].finish_reason,
    tweets,
    blogPosts: [{ text: extractedBlog }],
  }
}

function selectBestModel(chatMessages: ChatMessage[]) {
  let model = 'gpt-3.5-turbo'
  const length = encode(chatMessages[0].content).length
  if (length > 15750) {
    throw new Error(
      'Too many tokens! Too much happened during this period for the LLM to make sense of it.',
    )
  }
  if (length > 3800) {
    model = 'gpt-3.5-turbo-16k'
  }
  console.log('using gpt model', model)
  return model
}
