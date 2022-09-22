import { GitConfigFileCacheService } from './GitConfigFileCacheService'

describe('GitConfigFileCacheService', () => {
  it('is an expected response', async () => {
    const result = GitConfigFileCacheService.transformToInstance('{}')
    expect(result.constructor.name).toEqual('GitConfigFileListCacheModel')
    // This test is broken
    // need to add a correct test string to the method call above
    expect(result).not.toBeUndefined()
    // then need to change assertion above to check for parsed items
    // expect(result.configList.length).toEqual(2)
  })
})
