import { IpcMainEvent, shell } from 'electron'
import { IIpcMainSendEventSub } from '../../IpcChannelTypes/IIpcMainSendEventSub'
import { OpenSubmitFeedbackPub } from './OpenSubmitFeedbackPub'

export class OpenSubmitFeedbackSub
  extends OpenSubmitFeedbackPub
  implements IIpcMainSendEventSub<string>
{
  handle(event: IpcMainEvent, message: string): void {
    console.log('OpenSubmitFeedbackSub.handle', message)
    shell.openExternal('https://forms.gle/yrCbvXSZy1juYivm8')
  }
}
