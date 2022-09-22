import { IpcMainEvent } from 'electron'
import { RemoveCertMessage, RemoveCertResponse } from './MessageTypes'
import { SshCertificateManager } from '../services/sshCertificates/SshCertificateManager'
import { RemoveCertFromSshAgentPub } from './RemoveCertFromSshAgentPub'
import { IIpcMainInvokeEventSub } from '../IpcChannelTypes/IIpcMainInvokeEventSub'

export class RemoveCertFromSshAgentSub
  extends RemoveCertFromSshAgentPub
  implements IIpcMainInvokeEventSub<RemoveCertMessage, RemoveCertResponse>
{
  async handle(
    event: IpcMainEvent,
    request: RemoveCertMessage
  ): Promise<RemoveCertResponse> {
    console.log(request)
    try {
      await SshCertificateManager.removeCertificateFromAgent(
        request.privateCertPath
      )
    } catch (error) {
      return { isInError: false, errorMessage: error as string }
    }

    return { isInError: false, errorMessage: undefined }
  }
}
