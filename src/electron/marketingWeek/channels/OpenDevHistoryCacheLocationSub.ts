import { IpcMainEvent, shell } from 'electron'
import { OpenDevHistoryCacheLocationPub } from './OpenDevHistoryCacheLocationPub'
import { IIpcMainSendEventSub } from '../../IpcChannelTypes/IIpcMainSendEventSub'
import { getBaseCachePath } from '../services/dev-history-cache'

export class OpenDevHistoryCacheLocationSub
  extends OpenDevHistoryCacheLocationPub
  implements IIpcMainSendEventSub<void>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(_event: IpcMainEvent): void {
    const path = getBaseCachePath()
    console.log('OpenDevHistoryCacheLocation.handle', path)
    shell.showItemInFolder(path)
  }
}
