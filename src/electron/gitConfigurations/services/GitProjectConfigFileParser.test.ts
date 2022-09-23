import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'

import ini from 'ini'
import { GitProtocolTypeEnum } from '../models/GitProtocolTypeEnum'

const sampleGlobalConfig = `[user]
name = Darragh ORiordan
email = darragh@emailer.com
[core]
excludesfile = /Users/darragh/.gitignore_global
editor = nano -w
pager = diff-so-fancy | less --tabs=4 -RFX`

const sampleSsh = {
  config: `[core]
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
email = darragh@emailer.com`,
  expected: {
    originRepositoryFileName: 'ssh-tool',
    path: '/Users/darragh/gitproject.git',
    potentialOrigins: [],
    id: 'L1VzZXJzL2RhcnJhZ2gvZ2l0cHJvamVjdC5naXQ=',
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
  },
}

const sampleHttp = {
  config: `[core]
repositoryformatversion = 0
filemode = true
bare = false
logallrefupdates = true
ignorecase = true
precomposeunicode = true
[remote "origin"]
url = https://github.com/darraghoriordan/darragh-oriordan-com.git
fetch = +refs/heads/*:refs/remotes/origin/*
[branch "master"]
remote = origin
merge = refs/heads/master
[user]
name = Darragh ORiordan
email = darragh@emailer.com`,
  expected: {
    originRepositoryFileName: 'darragh-oriordan-com',
    path: '/Users/darragh/gitproject.git',
    potentialOrigins: [],
    id: 'L1VzZXJzL2RhcnJhZ2gvZ2l0cHJvamVjdC5naXQ=',
    remotes: [
      {
        owner: 'darraghoriordan',
        pathname: '/darraghoriordan/darragh-oriordan-com.git',
        port: undefined,
        protocol: 'https',
        remoteName: 'origin',
        repoName: 'darragh-oriordan-com',
        source: 'github.com',
        type: GitProtocolTypeEnum.HTTP,
        url: 'https://github.com/darraghoriordan/darragh-oriordan-com.git',
        user: '',
      },
    ],
    user: {
      name: 'Darragh ORiordan',
      email: 'darragh@emailer.com',
    },
  },
}

const sampleNoOrigin = {
  config: `[core]
repositoryformatversion = 0
filemode = true
bare = false
logallrefupdates = true
ignorecase = true
precomposeunicode = true
[branch "master"]
remote = origin
merge = refs/heads/master
[user]
name = Darragh ORiordan
email = darragh@emailer.com`,
  expected: {
    originRepositoryFileName: 'Unknown Remote Origin',
    path: '/Users/darragh/gitproject.git',
    potentialOrigins: [],
    id: 'L1VzZXJzL2RhcnJhZ2gvZ2l0cHJvamVjdC5naXQ=',
    remotes: [],
    user: {
      name: 'Darragh ORiordan',
      email: 'darragh@emailer.com',
    },
  },
}

describe('GitProjectConfigFileParser', () => {
  it('can extract the origin remote repo name', () => {
    const result = GitProjectConfigFileParser.extractOriginGitRepoName(
      sampleSsh.expected
    )
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
    const iniResult = ini.parse(sampleSsh.config)
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
    const result = await GitProjectConfigFileParser.parseGitProjectConfig(
      sampleSsh.config,
      '/Users/darragh/gitproject.git'
    )
    expect(result).toMatchObject(sampleSsh.expected)
  })

  it('can parse https git config', async () => {
    const result = await GitProjectConfigFileParser.parseGitProjectConfig(
      sampleHttp.config,
      '/Users/darragh/gitproject.git'
    )
    expect(result).toMatchObject(sampleHttp.expected)
  })

  it('can parse no origin git config', async () => {
    const result = await GitProjectConfigFileParser.parseGitProjectConfig(
      sampleNoOrigin.config,
      '/Users/darragh/gitproject.git'
    )
    expect(result).toMatchObject(sampleNoOrigin.expected)
  })
})
