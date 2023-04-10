import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { HtmlEncoder } from '../HtmlEncoderService'
import { HtmlEncoderChannelPub } from './HtmlEncoderChannelPub'
import { HtmlEncoderMessage, HtmlEncoderResponse } from './MessageTypes'

export class HtmlEncoderChannelSub
  extends HtmlEncoderChannelPub
  implements IIpcMainInvokeEventSub<HtmlEncoderMessage, HtmlEncoderResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: HtmlEncoderMessage
  ): Promise<HtmlEncoderResponse> {
    if (request.encode) {
      return HtmlEncoder.encode(request.data, request.type)
    }

    return HtmlEncoder.decode(request.data, request.type)
  }
}
