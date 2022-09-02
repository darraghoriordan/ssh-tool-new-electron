import { IpcMainEvent, app } from 'electron'
import { GenerateCertMessage, GenerateCertResponse } from './MessageTypes'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'
import { GenerateCertPub } from './GenerateCertPub'

export class GenerateCertSub
  extends GenerateCertPub
  implements IIpcMainInvokeEventSub<GenerateCertMessage, GenerateCertResponse>
{
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
