import 'reflect-metadata'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import {
  ChannelConfigurationSubs,
  ChannelConfigurationTypeSub,
} from './channelConfigurationsSubs'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'
import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import { ApplicationSettingService } from './appSettings/services/ApplicationSettingService'
import path from 'path'
import { GitConfigsFileCacheService } from './gitConfigurations/services/GitConfigsFileCacheService'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

export default class Main {
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
      minHeight: 800,
      width: 1400,
      height: 800,
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

  setMenu() {
    const isMac = process.platform === 'darwin'
    const macMenu = isMac
      ? {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        }
      : {}
    const template = [
      macMenu,
      // { role: 'fileMenu' }
      {
        label: 'File',
        submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
      },
      // { role: 'editMenu' }
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          ...(isMac
            ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                  label: 'Speech',
                  submenu: [
                    { role: 'startSpeaking' },
                    { role: 'stopSpeaking' },
                  ],
                },
              ]
            : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' },
              ]),
        ],
      },
      {
        label: 'View',
        submenu: [{ role: 'togglefullscreen' }],
      },
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const menu = Menu.buildFromTemplate(template as any)
    Menu.setApplicationMenu(menu)
  }
}

new Main().init(ChannelConfigurationSubs)
