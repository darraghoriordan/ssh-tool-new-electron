import 'reflect-metadata'
import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { ChannelConfigurationSubs } from './channelConfigurationsSubs'
import { ChannelConfigurationTypeSub } from './ChannelConfigurationTypeSub'
import { IIpcMainSendEventSub } from './IpcChannelTypes/IIpcMainSendEventSub'
import { IIpcMainInvokeEventSub } from './IpcChannelTypes/IIpcMainInvokeEventSub'
import path from 'path'
import { GitConfigsFileCacheService } from './gitConfigurations/services/GitConfigsFileCacheService'
import { UserSettingsService } from './userSettings/services/UserSettingsService'
import { ApplicationSettingService } from './appSettings/services/ApplicationSettingService'
import { RuntimeApplicationSettingsService } from './appSettings/services/RuntimeApplicationSettingsService'
import { IncrementApplicationRuns } from './licencing/services/incrementApplicationRuns'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

export default class Main {
  private mainWindow!: BrowserWindow | null

  public async init(config: ChannelConfigurationTypeSub) {
    try {
      // Initialise some static shit. This is a bit of a hack, but it works.
      // should really add some kind of DI framework to make this cleaner.

      const runtimeSettings = RuntimeApplicationSettingsService.getSettings()
      ApplicationSettingService.init(runtimeSettings)
      UserSettingsService.init(runtimeSettings)
      GitConfigsFileCacheService.init(runtimeSettings)

      await app.on('ready', this.createWindow).whenReady()

      console.log('registering channels...')
      this.registerIpChannels(config.rtmSendChannels, config.rtmInvokeChannels)
      console.log('channels registered')
    } catch (error) {
      console.error(error)
    }
    console.log('incrementing run count...')
    await IncrementApplicationRuns.increment()

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

  private createWindow() {
    const assetsPath = app.getAppPath()

    this.mainWindow = new BrowserWindow({
      icon: path.join(assetsPath, 'assets', 'icons', 'icon.png'),
      minWidth: 1400,
      minHeight: 800,
      width: 1400,
      height: 800,
      backgroundColor: '#191622',
      webPreferences: {
        devTools: !app.isPackaged,
        nodeIntegration: false,
        contextIsolation: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    })

    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

    if (process.env.NODE_ENV !== 'development') {
      Main.setMenu()
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
    // Open the DevTools.
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools()
    }
  }

  private registerIpChannels(
    rtmSendChannels: IIpcMainSendEventSub<unknown>[],
    rtmInvokeChannels: IIpcMainInvokeEventSub<unknown, unknown>[]
  ) {
    // set up the handlers on the main process side
    rtmSendChannels.forEach(channel => {
      ipcMain.on(channel.getChannelName(), (event, request) =>
        channel.handle(event, request)
      )
    })

    rtmInvokeChannels.forEach(channel => {
      ipcMain.handle(channel.getChannelName(), (event, request) =>
        channel.handle(event, request)
      )
    })
  }

  private static setMenu() {
    const isMac = process.platform === 'darwin'
    const macMenu = {
      label: 'Local Dev Tools',
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

    const template = [
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
      // { role: 'viewMenu' }
      {
        label: 'View',
        submenu: [
          //   { role: 'reload' },
          //   { role: 'forceReload' },
          //   { role: 'toggleDevTools' },
          //   { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' },
        ],
      },
    ]

    if (isMac) {
      template.unshift(macMenu)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const menu = Menu.buildFromTemplate(template as any)
    Menu.setApplicationMenu(menu)
  }
}

new Main().init(ChannelConfigurationSubs)
