import { Type } from 'class-transformer'
import { GitUser } from './GitUser'
import { GitRemote } from './GitRemote'

export class GitConfigInfo {
  @Type(() => GitUser)
  user!: GitUser

  originRepositoryFileName?: string
  path!: string

  @Type(() => GitRemote)
  remotes!: GitRemote[]

  @Type(() => GitRemote)
  potentialOrigins!: GitRemote[]
}
