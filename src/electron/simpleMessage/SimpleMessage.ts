import { IpcMainSendEventChannelInterface } from '../IpcChannelTypes/IpcMainSendEventChannelInterface'
import { IpcMainEvent, ipcRenderer } from 'electron'

export class SimpleMessage implements IpcMainSendEventChannelInterface<string> {
  public static ChannelName = 'message'
  public static ExposedApiName = 'SimpleMessage'
  getExposedApiName(): string {
    return SimpleMessage.ExposedApiName
  }

  getChannelName(): string {
    return SimpleMessage.ChannelName
  }

  invoke(message: string): void {
    ipcRenderer.send(SimpleMessage.ChannelName, message)
  }

  handle(event: IpcMainEvent, message: string): void {
    console.log(message)
  }
}
