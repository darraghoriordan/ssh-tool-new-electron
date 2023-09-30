const forgeConfig = {
  packagerConfig: {
    icon: 'src/assets/icons/icon',
    // This info.plist file contains file association for the app on macOS.
    extendInfo: './src/assets/mac-store-meta/info.plist',
    asar: true,
    darwinDarkModeSupport: 'false',
    // Electron-forge automatically adds the file extension based on OS

    // The binary name should always be uppercase. As we cannot specify
    // this on a per-maker basis, we need to output everything this way. With
    // this property, macOS builds are named Appname.app, Windows builds
    // Appname.exe and the linux binaries are called Appname (albeit on Linux,
    // lowercase is preferred). Due to the last issue (Linux binaries being
    // with capital Z) we have to explicitly set executableName on the Linux
    // target.
    name: 'LocalDevTools',
    // The certificate is written to the default keychain during CI build.
    // See ./scripts/add-osx-cert.sh
    osxSign: {
      tool: 'notarytool',
      identity: 'Developer ID Application: Darragh ORiordan (74NM54BFA4)',
      //   'hardened-runtime': true,
      //   'gatekeeper-assess': false,
      entitlements: 'src/assets/mac-store-meta/entitlements.plist',
      //   'entitlements-inherit': 'src/assets/mac-store-meta/entitlements.plist',
      //   'signature-flags': 'library',
    },
    // Since electron-notarize 1.1.0 it will throw instead of simply print a
    // warning to the console, so we have to actively check if we should
    // notarize or not. We do so by checking for the necessary environment
    // variables and set the osxNotarize option to false otherwise to prevent
    // notarization.
    osxNotarize:
      'APPLE_ID' in process.env && 'APPLE_ID_PASS' in process.env
        ? {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASS,
            teamId: process.env.APPLE_TEAM_ID,
            tool: 'notarytool',
          }
        : false,

    extraResource: ['src/assets/icons/icon.icns'],
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'local-dev-tools',
        options: {
          iconUrl:
            'https://raw.githubusercontent.com/darraghoriordan/learn_databases/master/src/icons/icon.ico',
          setupIcon: '/path/to/icon.ico',
        },
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [],
    },
    {
      name: '@electron-forge/maker-appx',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: 'src/assets/icons/icon.png',
        },
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: 'src/assets/icons/icon.icns',
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: 'src/assets/icons/icon.png',
        },
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.cjs',
        renderer: {
          config: './webpack.renderer.config.cjs',
          entryPoints: [
            {
              html: './src/public/index.html',
              js: './src/app/index.tsx',
              name: 'main_window',
              preload: {
                js: './src/electron/bridge.ts',
              },
            },
          ],
        },
      },
    },
  ],
}

module.exports = forgeConfig
