import { Type } from 'class-transformer'
import { GitUser } from './GitUser'
import { GitRemote } from './GitRemote'

export class GitConfigInfo {
  @Type(() => GitUser)
  user!: GitUser | undefined

  originRepositoryFileName?: string
  path!: string
  id!: string

  @Type(() => GitRemote)
  remotes!: GitRemote[]

  @Type(() => GitRemote)
  potentialOrigins!: GitRemote[]
  isProjectUserSet!: boolean
  userAsIniString!: string | undefined
}
