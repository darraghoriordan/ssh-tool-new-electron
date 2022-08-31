import { Type } from 'class-transformer'
import { GitConfigInfo } from './GitConfigInfo'
import { GitUser } from './GitUser'

export class GitConfigFileSystemScannerResponse {
  foundDirectory!: boolean
  errorMessage?: string
  isInError!: boolean

  @Type(() => GitConfigInfo)
  contents!: GitConfigInfo[]

  @Type(() => GitUser)
  globalUser?: GitUser

  @Type(() => GitUser)
  allCustomUsers!: GitUser[]
}
