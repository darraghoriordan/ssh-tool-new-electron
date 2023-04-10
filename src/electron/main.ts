import 'reflect-metadata'
import { app, BrowserWindow, ipcMain, Menu, screen } from 'electron'
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
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'

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

  private async createWindow() {
    const assetsPath = app.getAppPath()
    if (!app.isPackaged) {
      try {
        await installExtension(REACT_DEVELOPER_TOOLS)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(
          `Could not install DevTools extension: ${String(err.message)}`,
          err
        )
      }
    }
    app.setAboutPanelOptions({
      applicationName: 'Local Dev Tools',
      applicationVersion: app.getVersion(),
      copyright: `Copyright (c) 2021 - ${new Date().getFullYear()} by Darragh ORiordan`,
      // version: If we ever introduce a build number. This defaults to the Electron version.
      credits:
        'Thanks to all the contributors to open source projects that make an app like possible for one person to build.',
      authors: ['Darragh ORiordan'], // TODO: Somehow generate the contributors list.
      website: 'https://www.darraghoriordan.com/',
      iconPath: process.execPath,
    })
    function getInitialWindowDimensions(primaryDisplay: Electron.Display): {
      width: number
      height: number
    } {
      // start off full screen on small screens, otherwise 80% of the screen.
      const dimensions = {
        width: primaryDisplay.size.width,
        height: primaryDisplay.size.height,
      }
      // limit the width if the screen is big
      if (primaryDisplay.size.width > 1720) {
        dimensions.width = primaryDisplay.size.width * 0.7
      }
      // limit the height if the screen is big
      if (primaryDisplay.size.height > 1080) {
        dimensions.height = primaryDisplay.size.height * 0.8
      }

      return dimensions
    }
    const primaryDisplay = screen.getPrimaryDisplay()
    const initialDimensions = getInitialWindowDimensions(primaryDisplay)

    this.mainWindow = new BrowserWindow({
      icon: path.join(assetsPath, 'assets', 'icons', 'icon.png'),
      minWidth: 1400 / primaryDisplay.scaleFactor,
      minHeight: 800 / primaryDisplay.scaleFactor,
      width: initialDimensions.width,
      height: initialDimensions.height,
      backgroundColor: '#191622',
      webPreferences: {
        devTools: !app.isPackaged,
        nodeIntegration: false,
        contextIsolation: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      },
    })
    this.mainWindow.center()
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
process.on('unhandledRejection', (err: any) => {
  // Just log to console.
  console.error('[Application] Unhandled rejection received', err)
})

new Main().init(ChannelConfigurationSubs)
