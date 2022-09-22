import { GitConfigInfo } from '../../services/gitConfigSystemScanner/models/GitConfigInfo'
import { GitConfigFileListCacheModel } from '../models/GitConfigFileListCacheModel'
import { GitConfigFilesListSub } from './GitConfigFilesListSub'

describe('GitConfigFilesListSub', () => {
  let classUnderTest: GitConfigFilesListSub

  beforeEach(() => {
    jest.resetAllMocks()
    classUnderTest = new GitConfigFilesListSub()
  })
  const noCacheFileFound = new GitConfigFileListCacheModel()
  noCacheFileFound.configList = []
  const cacheItemsFound = new GitConfigFileListCacheModel()
  cacheItemsFound.configList = [new GitConfigInfo()]

  test.each([
    [noCacheFileFound, true],
    [cacheItemsFound, false],
  ])(
    'is an expected response',
    (input: GitConfigFileListCacheModel, expected: boolean) => {
      const result = classUnderTest.shouldRescan(input)
      expect(result).toEqual(expected)
    }
  )
})
