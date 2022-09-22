import { GitConfigInfo } from '../../services/gitConfigSystemScanner/models/GitConfigInfo'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'
import { GitConfigsService } from './GitConfigsService'

describe('GitConfigFilesListSub', () => {
  const noCacheFileFound = new GitConfigsModel()
  noCacheFileFound.configList = []
  const cacheItemsFound = new GitConfigsModel()
  cacheItemsFound.configList = [new GitConfigInfo()]

  test.each([
    [noCacheFileFound, true],
    [cacheItemsFound, false],
  ])('is an expected response', (input: GitConfigsModel, expected: boolean) => {
    const result = GitConfigsService.shouldRescan(input)
    expect(result).toEqual(expected)
  })
})
