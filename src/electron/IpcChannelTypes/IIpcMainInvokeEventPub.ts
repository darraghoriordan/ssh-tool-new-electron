export type IIpcMainInvokeEventPub<T, S> = {
  getInvoker(): (message: T) => Promise<S>
  getExposedApiName(): string
  getChannelName(): string
}
