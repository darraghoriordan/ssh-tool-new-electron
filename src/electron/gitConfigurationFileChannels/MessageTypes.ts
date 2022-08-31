import { GitUser } from '../services/gitConfigSystemScanner/models/GitUser'
import { GitConfigInfo } from '../services/gitConfigSystemScanner/models/GitConfigInfo'

export type GitConfigScanResponseMessage = {
  path: string
  contents: GitConfigInfo[]
  errorMessage: string | undefined
  isInError: boolean
  foundHomeDirectory: boolean
  globalUser?: GitUser
  allCustomUsers: GitUser[]
  isCachedData: boolean
}

export type GitConfigFileScanRequestMessage = {
  forceFileSystemSearch: boolean
}
