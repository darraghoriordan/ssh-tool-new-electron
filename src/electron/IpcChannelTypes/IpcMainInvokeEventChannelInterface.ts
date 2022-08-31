import { IpcMainInvokeEvent } from 'electron'

export type IpcMainInvokeApi<T, S> = {
  invoke(request: T): Promise<S>
}

export interface IpcMainInvokeEventChannelInterface<T, S>
  extends IpcMainInvokeApi<T, S> {
  getExposedApiName(): string
  getChannelName(): string
  handle(event: IpcMainInvokeEvent, request: T): Promise<S>
}
