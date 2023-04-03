import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GitConfigFilesListPub } from './GitConfigFilesListPub'
import { GitConfigListRequest, GitConfigListResponse } from './MessageTypes'
import { GitConfigsService } from '../services/GitConfigsService'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'

export class GitConfigFilesListSub
  extends GitConfigFilesListPub
  implements
    IIpcMainInvokeEventSub<GitConfigListRequest, GitConfigListResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: GitConfigListRequest
  ): Promise<GitConfigListResponse> {
    const settings = await UserSettingsService.getSettings()
    const gitConfigFileData = await GitConfigsService.loadGitConfigs()

    const filteredConfigs = gitConfigFileData.configList.filter(config => {
      if (request.filter === undefined) {
        return true
      }

      return config.path.includes(request.filter)
    })
    const returnModel: GitConfigListResponse = {
      ...gitConfigFileData,
      configList: filteredConfigs,
      globalUser: undefined,
      globalGitConfigPath: settings.globalGitConfigFile,
    }
    return returnModel
  }
}
