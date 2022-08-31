export type IIpcMainSendEventPub<T> = {
  getChannelName(): string
  getExposedApiName(): string
  invoke(request: T): void
}
