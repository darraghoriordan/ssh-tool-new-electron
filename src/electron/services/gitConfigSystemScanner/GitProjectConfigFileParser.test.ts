import { GitProjectConfigFileParser } from './GitProjectConfigFileParser'
import { GitProtocolTypeEnum } from './models/GitProtocolTypeEnum'

const sampleGlobalConfig = `[user]
name = Darragh ORiordan
email = darragh@emailer.com
[core]
excludesfile = /Users/darragh/.gitignore_global
editor = nano -w
pager = diff-so-fancy | less --tabs=4 -RFX`

const sampleSshConfig = `[core]
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
describe('GitProjectConfigFileParser', () => {
  it('can parse global config', () => {
    const result = GitProjectConfigFileParser.parseGitUser(sampleGlobalConfig)
    expect(result).toMatchObject({
      name: 'Darragh ORiordan',
      email: 'darragh@emailer.com',
    })
  })

  it('can parse ssh git config', () => {
    const result = GitProjectConfigFileParser.parseGitProjectConfig(
      sampleSshConfig,
      '/Users/darragh/gitproject'
    )
    expect(result).toMatchObject({
      originRepositoryFileName: 'ssh-tool',
      path: '/Users/darragh/gitproject',
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
    })
  })
})
