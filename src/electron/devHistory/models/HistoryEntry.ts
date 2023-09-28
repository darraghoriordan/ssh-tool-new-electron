import z from 'zod'

export const GitCommitHistoryEntrySchema = z.object({
  type: z.literal('git commit'),
  date: z.coerce.date(),
  metadata: z.object({
    diff: z.string(),
    message: z.string(),
    repository: z.string().or(z.undefined()),
    authorName: z.string().or(z.undefined()),
    fileNames: z.array(z.string()),
  }),
})

export const BrowserHistoryEntrySchema = z.object({
  type: z.literal('browser history'),
  date: z.coerce.date(),
  metadata: z.object({
    url: z.string(),
    title: z.string(),
  }),
})

export const HistoryEntrySchema = z.union([
  GitCommitHistoryEntrySchema,
  BrowserHistoryEntrySchema,
])

export type HistoryEntry = z.infer<typeof HistoryEntrySchema>
export type GitCommitHistoryEntry = z.infer<typeof GitCommitHistoryEntrySchema>
export type BrowserHistoryEntry = z.infer<typeof BrowserHistoryEntrySchema>
