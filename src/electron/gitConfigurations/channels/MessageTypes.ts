import { GitUser } from '../../services/gitConfigSystemScanner/models/GitUser'
import { GitConfigInfo } from '../../services/gitConfigSystemScanner/models/GitConfigInfo'

export type GitConfigListResponse = {
  searchedPath: string
  configList: GitConfigInfo[]
  globalUser?: GitUser
}
