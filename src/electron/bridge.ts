/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata'
import { contextBridge, ipcRenderer } from 'electron'
import {
  ChannelConfigurations,
  ChannelConfigurationType,
} from './channelConfigurations'
import { IpcMainInvokeEventChannelInterface } from './IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { IpcMainSendEventChannelInterface } from './IpcChannelTypes/IpcMainSendEventChannelInterface'

export const api = {
  /**
   * Provide a generic way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

class Bridge {
  public async init(config: ChannelConfigurationType) {
    try {
      console.log(`Registering FE bridge methods...`)
      await this.registerBridgeMethods(
        config.rtmSendChannels,
        config.rtmInvokeChannels
      )
      console.log(`FE bridge methods registered`)
    } catch (error) {
      console.error(error)
    }
  }

  registerBridgeMethods(
    rtmSendChannels: IpcMainSendEventChannelInterface<any>[],
    rtmInvokeChannels: IpcMainInvokeEventChannelInterface<any, any>[]
  ) {
    // set up bridge methods to be added on the window object in react app
    rtmInvokeChannels.forEach(channel => {
      console.log(`adding FE bridge for ${channel.getExposedApiName()}`)
      contextBridge.exposeInMainWorld(channel.getExposedApiName(), {
        invoke: channel.invoke,
      })
      console.log(`added FE bridge for ${channel.getExposedApiName()}`)
    })
    rtmSendChannels.forEach(channel => {
      console.log(`adding FE bridge for ${channel.getExposedApiName()}`)
      contextBridge.exposeInMainWorld(channel.getExposedApiName(), {
        invoke: channel.invoke,
      })
      console.log(`added FE bridge for ${channel.getExposedApiName()}`)
    })

    // add a generic handler for messages from main back to renderer
    contextBridge.exposeInMainWorld('Main', api)
  }
}

new Bridge().init(ChannelConfigurations)
