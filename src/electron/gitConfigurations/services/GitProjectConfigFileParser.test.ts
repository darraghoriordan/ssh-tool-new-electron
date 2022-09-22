import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'
import { GitProtocolTypeEnum } from '../../services/gitConfigSystemScanner/models/GitProtocolTypeEnum'
import ini from 'ini'

const sampleGlobalConfig = `[user]
name = Darragh ORiordan
email = darragh@emailer.com
[core]
excludesfile = /Users/darragh/.gitignore_global
editor = nano -w
pager = diff-so-fancy | less --tabs=4 -RFX`

const sampleConfig = `[core]
repositoryformatversion = 0
filemode = true
bare = false
logallrefupdates = true
ignorecase = true
precomposeunicode = true
[remote "origin"]
url = git@pgh:darraghoriordan/ssh-tool.git
fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
remote = origin
merge = refs/heads/master
[user]
name = Darragh ORiordan
email = darragh@emailer.com`

const expectedMappedConfig = {
  originRepositoryFileName: 'ssh-tool',
  path: '/Users/darragh/gitproject',
  potentialOrigins: [],
  id: 'L1VzZXJzL2RhcnJhZ2gvZ2l0cHJvamVjdA==',
  remotes: [
    {
      owner: 'darraghoriordan',
      pathname: '/darraghoriordan/ssh-tool.git',
      port: undefined,
      protocol: 'ssh',
      remoteName: 'origin',
      repoName: 'ssh-tool',
      source: 'pgh',
      type: GitProtocolTypeEnum.SSH,
      url: 'git@pgh:darraghoriordan/ssh-tool.git',
      user: 'git',
    },
  ],
  user: {
    name: 'Darragh ORiordan',
    email: 'darragh@emailer.com',
  },
}

describe('GitProjectConfigFileParser', () => {
  it('can extract the origin remote repo name', () => {
    const result =
      GitProjectConfigFileParser.extractOriginGitRepoName(expectedMappedConfig)
    expect(result).toEqual('ssh-tool')
  })

  test.each([
    ['remote "origin"', 'origin'],
    ['remote "origin"  ', 'origin'],
  ])('can map url types', (input: string, expected: string) => {
    const result = GitProjectConfigFileParser.cleanRemoteName(input)
    expect(result).toEqual(expected)
  })

  test.each([
    ['ssh', GitProtocolTypeEnum.SSH],
    ['https', GitProtocolTypeEnum.HTTP],
    ['http', GitProtocolTypeEnum.HTTP],
  ])('can map url types', (input: string, expected: GitProtocolTypeEnum) => {
    const result = GitProjectConfigFileParser.mapUrlType(input)
    expect(result).toEqual(expected)
  })

  it('can parse remote names from the ini output', () => {
    const iniResult = ini.parse(sampleConfig)
    const result = GitProjectConfigFileParser.filterIniKeys(
      iniResult,
      /^remote /
    )
    expect(result).toMatchObject(['remote "origin"'])
  })

  it('can parse global config user', () => {
    const result = GitProjectConfigFileParser.parseGitUser(sampleGlobalConfig)
    expect(result).toMatchObject({
      name: 'Darragh ORiordan',
      email: 'darragh@emailer.com',
    })
  })

  it('can parse ssh git config', async () => {
    // ApplicationSettingService.init({
    //   settingsFilePath: '/some/path',
    //   overrideSettings: new ApplicationSettings(),
    // })
    const result = await GitProjectConfigFileParser.parseGitProjectConfig(
      sampleConfig,
      '/Users/darragh/gitproject'
    )
    expect(result).toMatchObject(expectedMappedConfig)
  })
})
