import { IpcMainEvent } from 'electron'
import { IIpcMainSendEventPub } from './IIpcMainSendEventPub'

export interface IIpcMainSendEventSub<T> extends IIpcMainSendEventPub<string> {
  handle(event: IpcMainEvent, request: T): void
}
