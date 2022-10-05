import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { UrlEncoder } from '../UrlEncoderService'
import { UrlEncoderChannelPub } from './UrlEncoderChannelPub'
import { UrlEncoderMessage, UrlEncoderResponse } from './MessageTypes'

export class UrlEncoderChannelSub
  extends UrlEncoderChannelPub
  implements IIpcMainInvokeEventSub<UrlEncoderMessage, UrlEncoderResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: UrlEncoderMessage
  ): Promise<UrlEncoderResponse> {
    console.log('UrlEncoderChannelSub.handle()', request)
    // components
    if (request.component) {
      if (request.encode) {
        return UrlEncoder.encodeForUriComponent(request.data)
      }

      return UrlEncoder.decodeForUriComponent(request.data)
    }
    // full uris
    if (request.encode) {
      return UrlEncoder.encodeForUri(request.data)
    }

    return UrlEncoder.decodeForUri(request.data)
  }
}
