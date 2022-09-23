import { Type } from 'class-transformer'
import { GitConfigInfo } from './GitConfigInfo'
import { GitUser } from '../models/GitUser'

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
