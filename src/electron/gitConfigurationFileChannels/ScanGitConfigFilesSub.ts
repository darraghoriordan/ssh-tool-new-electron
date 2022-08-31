import { IpcMainEvent, app } from 'electron'
import path from 'path'
import {
  GitConfigFileScanRequestMessage,
  GitConfigScanResponseMessage,
} from './MessageTypes'
import GitConfigFileSystemScanner from '../services/gitConfigSystemScanner/GitConfigFileSystemScanner'
import util from 'util'
import { GitConfigFileCacheService } from '../services/gitConfigSystemScanner/GitConfigFileCacheService'
import { ScanGitConfigFilesPub } from './ScanGitConfigFilesPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSube'

export class ScanGitConfigFilesSub
  extends ScanGitConfigFilesPub
  implements
    IIpcMainInvokeEventSub<
      GitConfigFileScanRequestMessage,
      GitConfigScanResponseMessage
    >
{
  async handle(
    event: IpcMainEvent,
    request: GitConfigFileScanRequestMessage
  ): Promise<GitConfigScanResponseMessage> {
    const gitConfigFilePath = path.join(app.getPath('home'))
    const gitConfigCacheService = new GitConfigFileCacheService()
    const response: GitConfigScanResponseMessage = {
      path: gitConfigFilePath,
      contents: [],
      foundHomeDirectory: true,
      errorMessage: undefined,
      isInError: false,
      isCachedData: false,
      allCustomUsers: [],
    }

    const cachedConfigData = await gitConfigCacheService.loadFile()

    if (
      !request.forceFileSystemSearch &&
      cachedConfigData?.contents?.length > 0
    ) {
      console.log('Local github config found')
      response.contents = cachedConfigData.contents
      response.errorMessage = cachedConfigData.errorMessage
      response.isInError = cachedConfigData.isInError
      response.foundHomeDirectory = cachedConfigData.foundDirectory
      response.globalUser = cachedConfigData.globalUser
      response.allCustomUsers = cachedConfigData.allCustomUsers
      response.isCachedData = true
    } else {
      console.log(
        `Scanning system (${gitConfigFilePath}) for git config files...`
      )
      const readConfigResponse = await GitConfigFileSystemScanner.scan(
        gitConfigFilePath,
        app.getPath('home')
      )
      response.contents = readConfigResponse.contents
      response.errorMessage = readConfigResponse.errorMessage
      response.isInError = readConfigResponse.isInError
      response.foundHomeDirectory = readConfigResponse.foundDirectory
      response.globalUser = readConfigResponse.globalUser
      response.allCustomUsers = readConfigResponse.allCustomUsers
      await gitConfigCacheService.saveFile(readConfigResponse)
    }

    console.log('returning response', util.inspect(response, undefined, 4))
    return response
  }
}
