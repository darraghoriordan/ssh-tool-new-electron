import {
  simpleGit,
  SimpleGitOptions,
  LogResult,
  DefaultLogFields,
  SimpleGit,
} from 'simple-git'
import { GitConfigsService } from '../../gitConfigurations/services/GitConfigsService'
import { GitCommitHistoryEntry } from '../models/HistoryEntry'
import { removeGitConfig } from './month-analyser'

export async function readSingleGitRepoHistory({
  gitRepoPath,
  startDate,
  endDate,
}: {
  gitRepoPath: string
  startDate: Date
  endDate: Date
}) {
  let git: SimpleGit | undefined

  const options: Partial<SimpleGitOptions> = {
    baseDir: gitRepoPath,
    binary: 'git',
    maxConcurrentProcesses: 6,
    trimmed: false,
  }
  let commitsInDateRange: LogResult<DefaultLogFields> | undefined = undefined
  try {
    // Create a simple-git instance to interact with the repository
    git = simpleGit(options)
    const logParams = [
      `--since='${startDate.toISOString()}'`,
      `--until='${endDate.toISOString()}'`,
    ]

    // Fetch all commits in the repository for the date range
    // seems like if the repo is empty, or there are no results, this throws an error

    commitsInDateRange = await git.log(logParams)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `Error fetching logs.
      Repo: ${options.baseDir} 
      Error: ${JSON.stringify(error)}`,
    )
    commitsInDateRange = { total: 0, all: [], latest: null }
  }
  if (!git || commitsInDateRange.total === 0) {
    return []
  }
  try {
    const commitAndDiffs: GitCommitHistoryEntry[] = []
    // Get the diffs for each commit in the date range
    for (const commit of commitsInDateRange.all) {
      const commitDiff = await git.raw(['--no-pager', 'show', commit.hash])

      const filenames = await git.raw(['diff', commit.hash, '--name-only'])

      commitAndDiffs.push({
        type: 'git commit',
        date: new Date(commit.date),
        metadata: {
          diff: commitDiff,
          message: commit.message,
          repository: gitRepoPath,
          authorName: commit.author_name,
          fileNames: filenames
            .split('\n')
            .filter(Boolean)
            .map(f => f.trim()),
        },
      })
    }

    return commitAndDiffs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      `Error fetching commit diffs: ${options.baseDir} ${JSON.stringify(
        error,
      )}`,
    )
  }
}
export async function readGitHistory({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): Promise<GitCommitHistoryEntry[]> {
  const gitConfigs = await GitConfigsService.loadGitConfigs()

  const gitPromises = gitConfigs.configList.map(async config => {
    const gitRepoPath = removeGitConfig(config.path)
    return readSingleGitRepoHistory({
      gitRepoPath,
      startDate,
      endDate,
    })
  })

  const gitHistory = await Promise.allSettled(gitPromises)
  gitHistory.forEach(result => {
    if (result.status === 'rejected') {
      console.error(result.reason)
    }
  })

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
