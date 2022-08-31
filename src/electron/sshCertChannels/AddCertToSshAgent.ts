/* eslint-disable no-unused-vars */
import { IpcMainEvent, ipcRenderer } from 'electron'
import { IpcMainInvokeEventChannelInterface } from '../IpcChannelTypes/IpcMainInvokeEventChannelInterface'
import { AddCertMessage, AddCertResponse } from './MessageTypes'
import { CertChannels } from './CertChannelEnum'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'

export class AddCertToSshAgent
  implements
    IpcMainInvokeEventChannelInterface<AddCertMessage, AddCertResponse>
{
  public static ExposedApiName = 'AddCertToSshAgent'

  getExposedApiName(): string {
    return AddCertToSshAgent.ExposedApiName
  }

  getChannelName(): string {
    return CertChannels.ADD_CERT_TO_SSH_AGENT
  }

  async invoke(request: AddCertMessage): Promise<AddCertResponse> {
    return ipcRenderer.invoke(CertChannels.ADD_CERT_TO_SSH_AGENT, request)
  }

  async handle(
    event: IpcMainEvent,
    request: AddCertMessage
  ): Promise<AddCertResponse> {
    console.log(request)

    await SshCertificateManager.addCertificateToAgent(request.privateCertPath)

    return { isInError: false, errorMessage: undefined }
  }
}
