import { GitUser } from '..//models/GitUser'
import { GitConfigInfo } from '../models/GitConfigInfo'

export type GitConfigListResponse = {
  searchedPath: string
  configList: GitConfigInfo[]
  globalUser?: GitUser | undefined
  globalGitConfigPath: string
}

export type GitConfigListRequest = {
  filter: string | undefined
}
