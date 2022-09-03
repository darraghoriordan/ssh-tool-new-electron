import { IIpcMainInvokeEventPub } from './IpcChannelTypes/IIpcMainInvokeEventPub'
import { IIpcMainSendEventPub } from './IpcChannelTypes/IIpcMainSendEventPub'

export type ChannelConfigurationTypePub = {
  rtmSendChannels: IIpcMainSendEventPub<unknown>[]
  rtmInvokeChannels: IIpcMainInvokeEventPub<unknown, unknown>[]
}
