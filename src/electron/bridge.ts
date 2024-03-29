/* eslint-disable @typescript-eslint/no-explicit-any */
//import 'reflect-metadata'
import { contextBridge, ipcRenderer } from 'electron'
import { ChannelConfigurationPubs } from './channelConfigurationsPubs'
import { IIpcMainSendEventPub } from './IpcChannelTypes/IIpcMainSendEventPub'
import { IIpcMainInvokeEventPub } from './IpcChannelTypes/IIpcMainInvokeEventPub'
import { ChannelConfigurationTypePub } from './ChannelConfigurationTypePub'

export const api = {
  /**
   * Provide a generic way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

class Bridge {
  public async init(config: ChannelConfigurationTypePub) {
    try {
      console.log(`Registering FE bridge methods...`)
      await this.registerBridgeMethods(
        config.rtmSendChannels,
        config.rtmInvokeChannels
      )
      console.log(
        `${
          config.rtmInvokeChannels.length + config.rtmSendChannels.length
        } FE bridge methods registered`
      )
    } catch (error) {
      console.error(error)
    }
  }

  registerBridgeMethods(
    rtmSendChannels: IIpcMainSendEventPub[],
    rtmInvokeChannels: IIpcMainInvokeEventPub[]
  ) {
    contextBridge.exposeInMainWorld('electronApiTest', {
      test: (message: string) => console.log(message),
    })
    // set up bridge methods to be added on the window object in react app
    rtmInvokeChannels.forEach(channel => {
      contextBridge.exposeInMainWorld(channel.getExposedApiName(), {
        invoke: (message: any) =>
          ipcRenderer.invoke(channel.getChannelName(), message),
      })
    })
    rtmSendChannels.forEach(channel => {
      contextBridge.exposeInMainWorld(channel.getExposedApiName(), {
        invoke: (message: any) =>
          ipcRenderer.send(channel.getChannelName(), message),
      })
    })

    // add a generic handler for messages from main back to renderer
    contextBridge.exposeInMainWorld('Main', api)
  }
}
// const emptyTester = { rtmSendChannels: [], rtmInvokeChannels: [] }
new Bridge().init(ChannelConfigurationPubs)
