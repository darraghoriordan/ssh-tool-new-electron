/* eslint-disable @typescript-eslint/no-explicit-any */
//import 'reflect-metadata'
import { ipcRenderer } from 'electron'
// import {
//   ChannelConfigurationPubs,
//   ChannelConfigurationTypePub,
// } from './channelConfigurationsPubs'
// import { IIpcMainSendEventPub } from './IpcChannelTypes/IIpcMainSendEventPub'
// import { IIpcMainInvokeEventPub } from './IpcChannelTypes/IIpcMainInvokeEventPub'

export const api = {
  /**
   * Provide a generic way to listen to events
   */
  on: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
}

class Bridge {
  public async init() {
    try {
      console.log(`Registering FE bridge methods...`)
      //   await this.registerBridgeMethods(
      //     config.rtmSendChannels,
      //     config.rtmInvokeChannels
      //   )
      console.log(`All FE bridge methods registered`)
    } catch (error) {
      console.error(error)
    }
  }
}
//   registerBridgeMethods(
//     rtmSendChannels: IIpcMainSendEventPub<any>[],
//     rtmInvokeChannels: IIpcMainInvokeEventPub<any, any>[]
//   ) {
//     // set up bridge methods to be added on the window object in react app
//     rtmInvokeChannels.forEach(channel => {
//       console.log(`adding FE bridge for ${channel.getExposedApiName()}`)
//       contextBridge.exposeInMainWorld(channel.getExposedApiName(), {
//         invoke: channel.invoke,
//       })
//       console.log(`added FE bridge for ${channel.getExposedApiName()}`)
//     })
//     rtmSendChannels.forEach(channel => {
//       console.log(`adding FE bridge for ${channel.getExposedApiName()}`)
//       contextBridge.exposeInMainWorld(channel.getExposedApiName(), {
//         invoke: channel.invoke,
//       })
//       console.log(`added FE bridge for ${channel.getExposedApiName()}`)
//     })

//     // add a generic handler for messages from main back to renderer
//     contextBridge.exposeInMainWorld('Main', api)
//   }
// }
//const emptyTester = { rtmSendChannels: [], rtmInvokeChannels: [] };
new Bridge().init()
