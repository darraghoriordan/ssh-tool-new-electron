import { IIpcMainSendEventPub } from './IIpcMainSendEventPub'

export class SendChannelBasePub implements IIpcMainSendEventPub {
  constructor(private apiName: string, private channelName: string) {}

  getExposedApiName(): string {
    return this.apiName
  }
  getChannelName(): string {
    return this.channelName
  }
}
