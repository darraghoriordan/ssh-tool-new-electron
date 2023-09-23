import path from 'path'
import { app } from 'electron'

import { simpleGit } from 'simple-git'
import { GitConfigsService } from '../../gitConfigurations/services/GitConfigsService'
import { GitCommitHistoryEntry } from '../models/HistoryEntry'

export const electronAppTempPath = path.join(
  app.getPath('userData'),
  'chromeHistory.sqlite',
)

export async function readGitHistory({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): Promise<GitCommitHistoryEntry[]> {
  const gitConfigs = await GitConfigsService.loadGitConfigs()

  const gitPromises = gitConfigs.configList.map(async config => {
    // Create a simple-git instance to interact with the repository
    const git = simpleGit(
      config.path.includes('/.git/config')
        ? config.path.replace('/.git/config', '')
        : config.path,
    )

    try {
      // Fetch all commits in the repository for the date range
      const commitsInDateRange = await git.log([
        `--since='${startDate.toISOString()}'`,
        `--to='${endDate.toISOString()}'`,
      ])

      if (commitsInDateRange.total === 0) {
        return []
      }
      const commitAndDiffs: GitCommitHistoryEntry[] = []
      // Get the diffs for each commit in the date range
      for (const commit of commitsInDateRange.all) {
        const commitDiff = await git.diff([commit.hash])
        const filenames = await git.diff(['--name-only', commit.hash])
        commitAndDiffs.push({
          type: 'git commit',
          date: new Date(commit.date),
          metadata: {
            diff: commitDiff,
            message: commit.message,
            fileNames: filenames.split('\n'),
          },
        })
      }

      return commitAndDiffs
    } catch (error: any) {
      throw new Error(`Error fetching commit diffs: ${error.message}`)
    }
  })

  const gitHistory = await Promise.allSettled(gitPromises)
  const gitHistoryEntries = gitHistory
    .filter(assertFulfilled)
    .filter(assertHasItems)
    .map(result => result.value)
    .flat()

  return gitHistoryEntries
}

export function assertHasItems<T>(
  item: PromiseFulfilledResult<ArrayLike<T>>,
): item is PromiseFulfilledResult<ArrayLike<T>> {
  return item.value.length > 0
}

export function assertFulfilled<T>(
  item: PromiseSettledResult<T>,
): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled'
}
