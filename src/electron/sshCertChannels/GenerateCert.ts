import { IpcMainEvent, app, ipcRenderer } from 'electron'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { GenerateCertMessage, GenerateCertResponse } from './MessageTypes'
import { CertChannels } from './CertChannelEnum'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'

export class GenerateCert
  implements
    IpcMainInvokeEventChannelInterface<
      GenerateCertMessage,
      GenerateCertResponse
    >
{
  public static ExposedApiName = 'GenerateCert'

  getExposedApiName(): string {
    return GenerateCert.ExposedApiName
  }

  getChannelName(): string {
    return CertChannels.GENERATE_NEW_CERT
  }

  async invoke(request: GenerateCertMessage): Promise<GenerateCertResponse> {
    return ipcRenderer.invoke(CertChannels.GENERATE_NEW_CERT, request)
  }

  async handle(
    event: IpcMainEvent,
    request: GenerateCertMessage
  ): Promise<GenerateCertResponse> {
    console.log(request)

    return SshCertificateManager.generateCertificate(
      request,
      app.getPath('home')
    )
  }
}
