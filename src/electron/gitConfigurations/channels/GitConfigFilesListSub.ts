import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GitConfigFilesListPub } from './GitConfigFilesListPub'
import { GitConfigListResponse } from './MessageTypes'
import { GitConfigsService } from '../services/GitConfigsService'

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
    const configData = await GitConfigsService.loadGitConfigs()

    return configData
  }
}
