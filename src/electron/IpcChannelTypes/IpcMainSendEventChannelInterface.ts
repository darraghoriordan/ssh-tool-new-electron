import { IpcMainEvent } from 'electron'

export type IpcMainSendApi<T> = {
  invoke(request: T): void
}
export interface IpcMainSendEventChannelInterface<T> extends IpcMainSendApi<T> {
  getChannelName(): string
  getExposedApiName(): string
  handle(event: IpcMainEvent, request: T): void
}
