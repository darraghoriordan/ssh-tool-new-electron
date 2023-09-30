import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
import { readSingleGitRepoHistory } from './git-repository-history'

// These are just crappy integration tests to help with building the thing
describe('git-repository-history', () => {
  it('should handle git-repository-history', async () => {
    UserSettingsService.init({
      userSettingsFileLocation:
        '/mnt/c/Users/darragh/AppData/Roaming/LocalDevTools/userSettings.json',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    const increment = {
      startDate: new Date('2023-09-23T00:00:00.000Z'),
      endDate: new Date('2023-09-23T23:59:59.999Z'),
    }
    const gitEventsForPeriod = await readSingleGitRepoHistory({
      gitRepoPath: '../upgrade-js',
      ...increment,
    })
    expect(gitEventsForPeriod).toEqual([])
  })
})
