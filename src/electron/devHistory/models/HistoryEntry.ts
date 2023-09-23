export type HistoryEntry = GitCommitHistoryEntry | BrowserHistoryEntry
export interface GitCommitHistoryEntry {
  type: 'git commit'
  date: Date
  metadata: {
    diff: string
    message: string
    fileNames: string[]
  }
}

export interface BrowserHistoryEntry {
  type: 'browser history'
  date: Date
  metadata: {
    url: string
    title: string
  }
}
