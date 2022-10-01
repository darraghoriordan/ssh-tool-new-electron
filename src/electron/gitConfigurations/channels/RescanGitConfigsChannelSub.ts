import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GitConfigsService } from '../services/GitConfigsService'
import { RescanGitConfigsChannelPub } from './RescanGitConfigsChannelPub'

export class RescanGitConfigsChannelSub
  extends RescanGitConfigsChannelPub
  implements IIpcMainInvokeEventSub<void, void>
{
  async handle(event: IpcMainEvent, request: void): Promise<void> {
    try {
      return GitConfigsService.clearAllCaches()
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('error right in handler', (error as any).message)

      throw error
    }
  }
}
