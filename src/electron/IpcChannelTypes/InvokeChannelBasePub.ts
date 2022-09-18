import { IIpcMainInvokeEventPub } from './IIpcMainInvokeEventPub'

export class InvokeChannelBasePub implements IIpcMainInvokeEventPub {
  constructor(private apiName: string, private channelName: string) {}

  getExposedApiName(): string {
    return this.apiName
  }
  getChannelName(): string {
    return this.channelName
  }
}
