import { IpcMainEvent } from 'electron'

import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'
import { ScanForSshCertsResponse } from '../services/sshCertificates/Types'
import { SshCertFileCacheService } from '../services/sshCertificates/SshCertFileCacheService'
import { ScanForSshCertsMessage } from './MessageTypes'
import { ScanForSshCertsPub } from './ScanForSshCertsPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'
import { ApplicationSettingService } from '../appSettings/services/ApplicationSettingService'
export class ScanForSshCertsSub
  extends ScanForSshCertsPub
  implements
    IIpcMainInvokeEventSub<ScanForSshCertsMessage, ScanForSshCertsResponse>
{
  async handle(
    event: IpcMainEvent,
    request: ScanForSshCertsMessage
  ): Promise<ScanForSshCertsResponse> {
    console.log(request)
    const sshCertFileCacheService = new SshCertFileCacheService()
    const cachedConfigData = await sshCertFileCacheService.loadFile()
    const settings = await ApplicationSettingService.getSettings()
    if (
      !request.forceFileSystemSearch &&
      cachedConfigData.privateKeys &&
      cachedConfigData.privateKeys.length > 0
    ) {
      console.log('Local ssh cert config found')
      return {
        isInError: false,
        path: settings.sshCertPath,
        privateKeys: cachedConfigData.privateKeys,
        errorMessage: undefined,
      } as ScanForSshCertsResponse
    } else {
      const certScanResult = await SshCertificateManager.scanForCertificates()
      sshCertFileCacheService.saveFile({
        privateKeys: certScanResult.privateKeys,
      })

      return certScanResult
    }
  }
}
