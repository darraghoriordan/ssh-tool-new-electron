import { IpcMainInvokeEvent } from 'electron'

export interface IIpcMainInvokeEventSub<T, S> {
  getExposedApiName(): string
  getChannelName(): string
  handle(event: IpcMainInvokeEvent, request: T): Promise<S>
}
