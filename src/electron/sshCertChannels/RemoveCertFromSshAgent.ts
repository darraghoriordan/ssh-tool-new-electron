import { IpcMainEvent, app, ipcRenderer } from 'electron'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { RemoveCertMessage, RemoveCertResponse } from './MessageTypes'
import { CertChannels } from './CertChannelEnum'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'

export class RemoveCertFromSshAgent
  implements
    IpcMainInvokeEventChannelInterface<RemoveCertMessage, RemoveCertResponse>
{
  public static ExposedApiName = 'RemoveCertFromSshAgent'

  getExposedApiName(): string {
    return RemoveCertFromSshAgent.ExposedApiName
  }

  getChannelName(): string {
    return CertChannels.REMOVE_CERT_FROM_SSH_AGENT
  }

  async invoke(request: RemoveCertMessage): Promise<RemoveCertResponse> {
    return ipcRenderer.invoke(CertChannels.REMOVE_CERT_FROM_SSH_AGENT, request)
  }

  async handle(
    event: IpcMainEvent,
    request: RemoveCertMessage
  ): Promise<RemoveCertResponse> {
    console.log(request)
    try {
      await SshCertificateManager.removeCertificateFromAgent(
        request.privateCertPath,
        app.getPath('home')
      )
    } catch (error) {
      return { isInError: false, errorMessage: error as string }
    }

    return { isInError: false, errorMessage: undefined }
  }
}
