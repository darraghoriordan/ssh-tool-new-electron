import { IpcMainEvent, shell } from 'electron'
import { IIpcMainSendEventSub } from '../../IpcChannelTypes/IIpcMainSendEventSub'
import { OpenFileLocationPub } from './OpenFileLocationPub'

export class OpenFileLocationSub
  extends OpenFileLocationPub
  implements IIpcMainSendEventSub<string>
{
  handle(event: IpcMainEvent, message: string): void {
    console.log('OpenFileLocationSub.handle', message)
    shell.showItemInFolder(message)
  }
}
