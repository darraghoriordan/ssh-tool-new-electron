import { rawGitConfig } from '../../appSettings/models/TestData'
import { GitConfigFileCacheService } from './GitConfigFileCacheService'

describe('GitConfigFileCacheService', () => {
  it('is an expected response', () => {
    const result = GitConfigFileCacheService.transformToInstance(rawGitConfig)
    expect(result.constructor.name).toEqual('GitConfigFileListCacheModel')
    expect(result.configList.length).toEqual(2)
  })
})
