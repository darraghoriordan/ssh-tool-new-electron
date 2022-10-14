import { plainToInstance } from 'class-transformer'
import { GitConfigInfo } from '../models/GitConfigInfo'
import happyPathData from './GitConfigFileSystemScanner.data.json'
import complexIssuesData from './UsernameMapping.data.json'
import { UsernameWarningMapper } from './UsernameWarningMapper'

describe('UsernameWarningMapper', () => {
  it('no messages expected should be 0 result messages', async () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      happyPathData
    )

    const result = await UsernameWarningMapper.mapWarningMessagesForCommitNames(
      ghIniFiles
    )

    expect(result.length).toEqual(0)
  })

  it('can extract unique sources', () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      happyPathData
    )

    const result = UsernameWarningMapper.extractUniqueSources(ghIniFiles)

    expect(result.length).toEqual(1)
    expect(result[0]).toEqual('pgh')
  })

  it('can extract unique email addresses', () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      happyPathData
    )
    ghIniFiles[0].user = { name: 'test', email: 'some@different.email' }
    const result =
      UsernameWarningMapper.extractUniqueEmailsUsedForSource(ghIniFiles)

    expect(result.length).toEqual(2)
    expect(result[0]).toEqual('some@different.email')
    expect(result[1]).toEqual('darragh.oriordan@gmail.com')
  })

  it('can create a map of email addresses and the repos their used on', () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      happyPathData
    )
    ghIniFiles[0].user = { name: 'test', email: 'some@different.email' }
    const uniqueEmails =
      UsernameWarningMapper.extractUniqueEmailsUsedForSource(ghIniFiles)
    const result = UsernameWarningMapper.createMapOfEmailUsage(
      uniqueEmails,
      ghIniFiles
    )

    expect(result.get('darragh.oriordan@gmail.com')?.length).toEqual(6)
    expect(result.get('some@different.email')?.length).toEqual(1)
  })

  it('can find the least used email in the map of emails and repositories', () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      happyPathData
    )
    ghIniFiles[0].user = { name: 'test', email: 'some@different.email' }
    const uniqueEmails =
      UsernameWarningMapper.extractUniqueEmailsUsedForSource(ghIniFiles)
    const map = UsernameWarningMapper.createMapOfEmailUsage(
      uniqueEmails,
      ghIniFiles
    )

    const result = UsernameWarningMapper.findLeastUsedEmail(uniqueEmails, map)

    expect(result).toEqual('some@different.email')
  })

  it('changing the user one repo at a time results in a message containing that repository', async () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      happyPathData
    )
    ghIniFiles[0].user = { name: 'test', email: 'some@different.email' }

    const result = await UsernameWarningMapper.mapWarningMessagesForCommitNames(
      ghIniFiles
    )

    expect(result.length).toEqual(1)
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result[0]
    ).toEqual(
      `There is a mismatch between the git user set for [${ghIniFiles[0].originRepositoryFileName}] and the user set for other repositories with the same origin.`
    )
  })

  it('multiple sources and multiple users return multiple messages', async () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(
      GitConfigInfo,
      complexIssuesData
    )

    const result = await UsernameWarningMapper.mapWarningMessagesForCommitNames(
      ghIniFiles
    )

    expect(result.length).toEqual(2)
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result[0]
    ).toEqual(
      `There is a mismatch between the git user set for [darragh-oriordan-com, backstage-personal] and the user set for other repositories with the same origin.`
    )
    expect(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      result[1]
    ).toEqual(
      `There is a mismatch between the git user set for [nest-backend-libs] and the user set for other repositories with the same origin.`
    )
  })
})
