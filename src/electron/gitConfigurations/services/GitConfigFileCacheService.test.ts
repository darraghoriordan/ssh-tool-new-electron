import { GitConfigsFileCacheService } from './GitConfigsFileCacheService'

describe('GitConfigFileCacheService', () => {
  it('is an expected response', async () => {
    const result = GitConfigsFileCacheService.transformToInstance('{}')
    expect(result.constructor.name).toEqual('GitConfigsModel')
    // This test is broken
    // need to add a correct test string to the method call above
    expect(result).not.toBeUndefined()
    // then need to change assertion above to check for parsed items
    // expect(result.configList.length).toEqual(2)
  })
})
