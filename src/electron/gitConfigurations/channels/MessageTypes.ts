import { GitUser } from '..//models/GitUser'
import { GitConfigsModel } from '../models/GitConfigFileListCacheModel'

export class GitConfigListResponse extends GitConfigsModel {
  constructor(globalGitConfigPath: string) {
    super()
    this.globalGitConfigPath = globalGitConfigPath
  }
  globalUser: GitUser | undefined
  globalGitConfigPath: string
}

export type GitConfigListRequest = {
  filter: string | undefined
}
