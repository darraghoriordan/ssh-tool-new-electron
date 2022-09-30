import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'

export type ChannelConfigurationTypeSub = {
  rtmSendChannels: IIpcMainSendEventSub<unknown>[]
  rtmInvokeChannels: IIpcMainInvokeEventSub<unknown, unknown>[]
}
