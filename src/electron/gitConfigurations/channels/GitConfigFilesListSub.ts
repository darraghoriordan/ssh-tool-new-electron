import { IpcMainEvent } from 'electron'
import GitConfigFileSystemScanner from '../services/GitConfigFileSystemScanner'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GitConfigFilesListPub } from './GitConfigFilesListPub'
import { GitConfigListResponse } from './MessageTypes'
import { ApplicationSettingService } from '../../appSettings/services/ApplicationSettingService'
import { GitConfigFileCacheService } from '../services/GitConfigFileCacheService'

export class GitConfigFilesListSub
  extends GitConfigFilesListPub
  implements IIpcMainInvokeEventSub<void, GitConfigListResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: void
  ): Promise<GitConfigListResponse> {
    const settings = await ApplicationSettingService.getSettings()

    const response: GitConfigListResponse = {
      configList: [],
      searchedPath: settings.projectsPath,
      globalUser: undefined,
    }
    // try to find data in cache first
    let cacheData = await GitConfigFileCacheService.loadFile()

    if (cacheData?.configList?.length <= 0) {
      // scan the system for data
      console.log(
        `Scanning system (${settings.projectsPath}) for git config files...`
      )
      cacheData = await GitConfigFileSystemScanner.scan(settings.projectsPath)
      // cache the data for next time
      await GitConfigFileCacheService.saveFile(cacheData)
    }
    // map the data to a response for renderer
    response.configList = cacheData.configList
    response.globalUser = cacheData.globalUser

    return response
  }
}
