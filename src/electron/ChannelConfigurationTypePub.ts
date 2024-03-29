import { IIpcMainInvokeEventPub } from './IpcChannelTypes/IIpcMainInvokeEventPub'
import { IIpcMainSendEventPub } from './IpcChannelTypes/IIpcMainSendEventPub'

export type ChannelConfigurationTypePub = {
  rtmSendChannels: IIpcMainSendEventPub[]
  rtmInvokeChannels: IIpcMainInvokeEventPub[]
}
