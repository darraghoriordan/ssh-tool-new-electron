import { GitConfigInfo } from '../models/GitConfigInfo'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import { GitConfigsService } from './GitConfigsService'

describe('GitConfigFilesListSub', () => {
  const noCacheFileFound = new GitConfigsModel()
  noCacheFileFound.configList = []
  const cacheItemsFound = new GitConfigsModel()
  cacheItemsFound.configList = [new GitConfigInfo()]
  const cacheItemsFoundWithRecentScan = new GitConfigsModel()
  cacheItemsFoundWithRecentScan.created = new Date()
  cacheItemsFoundWithRecentScan.configList = [new GitConfigInfo()]

  test.each([
    [noCacheFileFound, true],
    [cacheItemsFound, true],
    [cacheItemsFoundWithRecentScan, false],
  ])('is an expected response', (input: GitConfigsModel, expected: boolean) => {
    const result = GitConfigsService.shouldRescan(input)
    expect(result).toBe(expected)
  })
})
