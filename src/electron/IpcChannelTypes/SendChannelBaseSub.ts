import { IpcMainEvent } from 'electron'

export abstract class SendChannelBaseSub<T> {
  constructor(private apiName: string, private channelName: string) {}

  getExposedApiName(): string {
    return this.apiName
  }
  getChannelName(): string {
    return this.channelName
  }

  abstract handle(event: IpcMainEvent, message: T): void
}
