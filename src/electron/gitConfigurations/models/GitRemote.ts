import { GitProtocolTypeEnum } from './GitProtocolTypeEnum'

export class GitRemote {
  url!: string
  type!: GitProtocolTypeEnum
  port?: number
  user?: string
  pathname!: string
  protocol!: string
  source!: string
  owner!: string
  repoName!: string
  remoteName!: string
}
