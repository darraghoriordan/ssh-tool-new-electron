import { HistoryEntrySchema } from './HistoryEntry'
import { IncrementGPTResponseSchema } from '../services/openai-service'
import { DateRangeSchema } from '../services/time-wrangler'
import { z } from 'zod'

export const IncrementAnalysisSchema = z.object({
  increment: DateRangeSchema,
  summary: z.string().or(z.undefined()),
  blogPosts: z.array(z.string()),
  tweets: z.array(z.object({ text: z.string() })),
  raw: z.object({
    events: z.array(HistoryEntrySchema),
    analysis: z.optional(IncrementGPTResponseSchema),
  }),
})

export const CacheFileSchema = z.array(IncrementAnalysisSchema)

export type IncrementAnalysis = z.infer<typeof IncrementAnalysisSchema>
