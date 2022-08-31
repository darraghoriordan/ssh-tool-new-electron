export type IIpcMainInvokeEventPub<T, S> = {
  invoke(request: T): Promise<S>
  getExposedApiName(): string
  getChannelName(): string
}
