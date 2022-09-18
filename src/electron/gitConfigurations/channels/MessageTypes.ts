import { GitUser } from '../../services/gitConfigSystemScanner/models/GitUser'
import { GitConfigInfo } from '../../services/gitConfigSystemScanner/models/GitConfigInfo'

export type GitConfigListResponseMessage = {
  searchedPath: string
  configList: GitConfigInfo[]
  globalUser?: GitUser
}
