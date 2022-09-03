import { ipcRenderer } from 'electron'
import { IIpcMainSendEventPub } from './IIpcMainSendEventPub'

export class SendChannelBasePub<T> implements IIpcMainSendEventPub<T> {
  constructor(private apiName: string, private channelName: string) {}

  getExposedApiName(): string {
    return this.apiName
  }
  getChannelName(): string {
    return this.channelName
  }

  getInvoker(): (message: T) => void {
    return (message: T) => ipcRenderer.send(this.channelName, message)
  }
}
