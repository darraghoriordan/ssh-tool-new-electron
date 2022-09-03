import { ipcRenderer } from 'electron'
import { IIpcMainInvokeEventPub } from './IIpcMainInvokeEventPub'

export class InvokeChannelBasePub<T, S>
  implements IIpcMainInvokeEventPub<T, S>
{
  constructor(private apiName: string, private channelName: string) {}

  getExposedApiName(): string {
    return this.apiName
  }
  getChannelName(): string {
    return this.channelName
  }

  getInvoker(): (message: T) => Promise<S> {
    return (message: T) => ipcRenderer.invoke(this.channelName, message)
  }
}
