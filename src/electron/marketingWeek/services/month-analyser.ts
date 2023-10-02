import {
  eachDayOfInterval,
  endOfDay,
  isFuture,
  isSameDay,
  startOfDay,
} from 'date-fns'
import { GitConfigsService } from '../../gitConfigurations/services/GitConfigsService'
import { readSingleGitRepoHistory } from './git-repository-history'
import { getFromCache, saveToCache } from './month-analyser-cache'
import path from 'path'

export async function gitActivityForMonth(
  startDate: Date,
  endDate: Date,
): Promise<Map<number, boolean>> {
  // get the list of dates for a month using date-fns
  const dates = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })
  const gitConfigs = await GitConfigsService.loadGitConfigs()
  console.log(`parsing ${gitConfigs.configList.length} git directories`)
  const hasCommitForDateMap =
    (await getFromCache(startDate.getTime(), endDate.getTime())) ||
    new Map<number, boolean>()
  for (const gitConfig of gitConfigs.configList) {
    // if all dates are true, we can stop right away
    if (areAllValuesTrue(hasCommitForDateMap)) {
      console.log(
        'all dates for time period true, stopping parsing git directories',
      )
      break
    }
    // otherwise get the commits for this repo
    const commits = await readSingleGitRepoHistory({
      gitRepoPath: removeGitConfig(gitConfig.path),
      startDate: startOfDay(startDate),
      endDate: endOfDay(endDate),
    })
    // and for each date that is not true, check if there is a commit on that day
    for (const date of dates) {
      // skip any dates in the future, we don't want to cache or check those
      if (isFuture(date)) {
        continue
      }
      if (!hasCommitForDateMap.get(date.getTime())) {
        hasCommitForDateMap.set(
          date.getTime(),
          commits.some(c => isSameDay(c.date, date)),
        )
      }
    }
  }
  // save it
  await saveToCache(startDate.getTime(), endDate.getTime(), hasCommitForDateMap)
  // return the map
  return hasCommitForDateMap
}
export function removeGitConfig(filePath: string) {
  const targetPath = path.normalize(filePath)
  const gitConfigPath = path.join('.git', 'config')

  if (targetPath.endsWith(gitConfigPath)) {
    // Remove ".git/config" from the end of the path
    return targetPath.slice(0, -gitConfigPath.length)
  } else {
    return targetPath
  }
}
function areAllValuesTrue(map: Map<number, boolean>) {
  const asArray = Array.from(map.values())
  return asArray.length > 0 && asArray.every(value => value === true)
}
