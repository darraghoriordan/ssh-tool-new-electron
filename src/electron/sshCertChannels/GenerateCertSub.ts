import { IpcMainEvent } from 'electron'
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
    return SshCertificateManager.generateCertificate(request)
  }
}
