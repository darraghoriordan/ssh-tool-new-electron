import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { Base64Encoder } from '../Base64EncoderService'
import { Base64EncoderChannelPub } from './Base64EncoderChannelPub'
import { Base64EncoderMessage, Base64EncoderResponse } from './MessageTypes'

export class Base64EncoderChannelSub
  extends Base64EncoderChannelPub
  implements
    IIpcMainInvokeEventSub<Base64EncoderMessage, Base64EncoderResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: Base64EncoderMessage
  ): Promise<Base64EncoderResponse> {
    if (request.encode) {
      return Base64Encoder.encode(request.data)
    }

    return Base64Encoder.decode(request.data)
  }
}
