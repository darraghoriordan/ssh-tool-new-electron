export type IIpcMainSendEventPub<T> = {
  getChannelName(): string
  getExposedApiName(): string
  getInvoker(): (message: T) => void
}
