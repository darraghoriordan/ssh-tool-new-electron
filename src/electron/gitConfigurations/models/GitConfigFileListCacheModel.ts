import { Type } from 'class-transformer'
import { GitConfigInfo } from '../../services/gitConfigSystemScanner/models/GitConfigInfo'
import { GitUser } from '../../services/gitConfigSystemScanner/models/GitUser'

export class GitConfigsModel {
  /**
   * The list of found git config file details
   */
  @Type(() => GitConfigInfo)
  configList!: GitConfigInfo[]

  /**
   * The global user is useful to show on the list items that use it
   */
  @Type(() => GitUser)
  globalUser?: GitUser

  searchedPath!: string
}
