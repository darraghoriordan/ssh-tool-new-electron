import 'reflect-metadata'
import { app, BrowserWindow, ipcMain } from 'electron'
import {
  ChannelConfigurationSubs,
  ChannelConfigurationTypeSub,
} from './channelConfigurationsSubs'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'
import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import { ApplicationSettingService } from './appSettings/services/ApplicationSettingService'
import path from 'path'
import { GitConfigsFileCacheService } from './gitConfigurations/services/GitConfigsFileCacheService'
import { SshCertFileCacheService } from './services/sshCertificates/SshCertFileCacheService'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

class Main {
  private mainWindow!: BrowserWindow | null

  public async init(config: ChannelConfigurationTypeSub) {
    try {
      // Initialise some static shit. This is a bit of a hack, but it works.
      // should really add some kind of DI framework to make this cleaner.

      ApplicationSettingService.init({
        settingsFilePath: path.join(
          app.getPath('userData'),
          'appSettings.json'
        ),
      })
      GitConfigsFileCacheService.init({
        gitConfigurationCacheFilePath: path.join(
          app.getPath('userData'),
          'gitConfigurationCache.json'
        ),
      })
      SshCertFileCacheService.init({
        sshCertCacheFilePath: path.join(
          app.getPath('userData'),
          'sshCertCacheFilePath.json'
        ),
      })

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
      minWidth: 1400,
      minHeight: 1200,
      width: 1400,
      height: 1200,
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
    rtmSendChannels: IIpcMainSendEventSub<unknown>[],
    rtmInvokeChannels: IIpcMainInvokeEventSub<unknown, unknown>[]
  ) {
    // set up the handlers on the main process side
    rtmSendChannels.forEach(channel => {
      console.log(`adding BE channel ${channel.getChannelName()}...`)
      ipcMain.on(channel.getChannelName(), (event, request) =>
        channel.handle(event, request)
      )
      console.log(`added BE channel ${channel.getChannelName()}`)
    })

    rtmInvokeChannels.forEach(channel => {
      console.log(`adding BE channel ${channel.getChannelName()}...`)
      ipcMain.handle(channel.getChannelName(), (event, request) =>
        channel.handle(event, request)
      )
      console.log(`added BE channel ${channel.getChannelName()}`)
    })
  }
}

new Main().init(ChannelConfigurationSubs)
