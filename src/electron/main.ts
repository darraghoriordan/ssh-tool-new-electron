import 'reflect-metadata'
import { app, BrowserWindow, ipcMain } from 'electron'
import { IpcMainSendEventChannelInterface } from './IpcChannelTypes/IpcMainSendEventChannelInterface'
import { IpcMainInvokeEventChannelInterface } from './IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import {
  ChannelConfigurations,
  ChannelConfigurationType,
} from './channelConfigurations'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

class Main {
  private mainWindow!: BrowserWindow | null

  public async init(config: ChannelConfigurationType) {
    try {
      await app.on('ready', this.createWindow).whenReady()
      console.log(`
      
      App ready, starting config
      
      `)
      console.log('registering channels...')
      await this.registerIpChannels(
        config.rtmSendChannels,
        config.rtmInvokeChannels
      )
      console.log('channels registered')
    } catch (error) {
      console.error(error)
    }

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })
  }

  // const assetsPath =
  //   process.env.NODE_ENV === 'production'
  //     ? process.resourcesPath
  //     : app.getAppPath()

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      // icon: path.join(assetsPath, 'assets', 'icon.png'),
      width: 1100,
      height: 700,
      backgroundColor: '#191622',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    })

    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
    // Open the DevTools.
    this.mainWindow.webContents.openDevTools()
  }

  registerIpChannels(
    rtmSendChannels: IpcMainSendEventChannelInterface<any>[],
    rtmInvokeChannels: IpcMainInvokeEventChannelInterface<any, any>[]
  ) {
    // set up the handlers on the main process side
    rtmSendChannels.forEach(channel => {
      console.log(`adding BE channel for ${channel.getExposedApiName()}...`)
      ipcMain.on(channel.getChannelName(), (event, request) =>
        channel.handle(event, request)
      )
      console.log(`added BE channel for ${channel.getExposedApiName()}`)
    })

    rtmInvokeChannels.forEach(channel => {
      console.log(`adding BE channel for ${channel.getExposedApiName()}...`)
      ipcMain.handle(channel.getChannelName(), (event, request) =>
        channel.handle(event, request)
      )
      console.log(`added BE channel for ${channel.getExposedApiName()}`)
    })
  }
}

new Main().init(ChannelConfigurations)
