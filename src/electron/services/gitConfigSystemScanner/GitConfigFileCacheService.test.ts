import { GitConfigFileCacheService } from './GitConfigFileCacheService'
import { rawGitConfig } from '../../appSettings/services/TestData'

describe('GitConfigFileCacheService', () => {
  let classUnderTest: GitConfigFileCacheService

  beforeEach(() => {
    jest.resetAllMocks()
    classUnderTest = new GitConfigFileCacheService()
  })

  it('is an expected response', () => {
    const result = classUnderTest.transformToInstance(rawGitConfig)
    expect(result.constructor.name).toEqual(
      'GitConfigFileSystemScannerResponse'
    )
    expect(result.contents.length).toEqual(2)
  })
})
