import { IpcMainEvent, app, ipcRenderer } from 'electron'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { CertChannels } from './CertChannelEnum'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'
import { ScanForSshCertsResponse } from '../services/sshCertificates/Types'
import { SshCertFileCacheService } from '../services/sshCertificates/SshCertFileCacheService'
import path from 'path'
import { ScanForSshCertsMessage } from './MessageTypes'
export class ScanForSshCerts
  implements
    IpcMainInvokeEventChannelInterface<
      ScanForSshCertsMessage,
      ScanForSshCertsResponse
    >
{
  public static ExposedApiName = 'ScanForSshCerts'

  getExposedApiName(): string {
    return ScanForSshCerts.ExposedApiName
  }

  getChannelName(): string {
    return CertChannels.SCAN_FOR_CERTS
  }

  async invoke(
    request: ScanForSshCertsMessage
  ): Promise<ScanForSshCertsResponse> {
    return ipcRenderer.invoke(CertChannels.SCAN_FOR_CERTS, request)
  }

  async handle(
    event: IpcMainEvent,
    request: ScanForSshCertsMessage
  ): Promise<ScanForSshCertsResponse> {
    console.log(request)
    const sshCertFileCacheService = new SshCertFileCacheService()
    const cachedConfigData = await sshCertFileCacheService.loadFile()

    if (
      !request.forceFileSystemSearch &&
      cachedConfigData.privateKeys &&
      cachedConfigData.privateKeys.length > 0
    ) {
      console.log('Local ssh cert config found')
      return {
        isInError: false,
        path: path.join(app.getPath('home'), '.ssh'),
        privateKeys: cachedConfigData.privateKeys,
        errorMessage: undefined,
      } as ScanForSshCertsResponse
    } else {
      const certScanResult = await SshCertificateManager.scanForCertificates(
        app.getPath('home')
      )
      sshCertFileCacheService.saveFile({
        privateKeys: certScanResult.privateKeys,
      })

      return certScanResult
    }
  }
}
