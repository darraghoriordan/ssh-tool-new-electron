import { IpcMainEvent, shell } from 'electron'
import { IIpcMainSendEventSub } from '../../IpcChannelTypes/IIpcMainSendEventSub'
import { OpenStorePagePub } from './OpenStorePagePub'

export class OpenStorePageSub
  extends OpenStorePagePub
  implements IIpcMainSendEventSub<string>
{
  handle(event: IpcMainEvent, message: string): void {
    console.log('OpenStorePageSub.handle', message)
    shell.openExternal('https://darraghoriordan.gumroad.com/l/localtools')
  }
}
