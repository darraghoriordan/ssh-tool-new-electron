/* eslint-disable no-unused-vars */
import { IpcMainEvent } from 'electron'
import { AddCertMessage, AddCertResponse } from './MessageTypes'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'
import { AddCertToSshAgentPub } from './AddCertToSshAgentPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSube'

export class AddCertToSshAgentSub
  extends AddCertToSshAgentPub
  implements IIpcMainInvokeEventSub<AddCertMessage, AddCertResponse>
{
  async handle(
    event: IpcMainEvent,
    request: AddCertMessage
  ): Promise<AddCertResponse> {
    console.log(request)

    await SshCertificateManager.addCertificateToAgent(request.privateCertPath)

    return { isInError: false, errorMessage: undefined }
  }
}
