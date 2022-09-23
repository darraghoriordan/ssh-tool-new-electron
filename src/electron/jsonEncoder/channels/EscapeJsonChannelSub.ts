import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { JsonEscaper } from '../JsonEscaperService'
import { EscapeJsonChannelPub } from './EscapeJsonChannelPub'
import { EscapeJsonMessage, EscapeJsonResponse } from './MessageTypes'

export class EscapeJsonChannelSub
  extends EscapeJsonChannelPub
  implements IIpcMainInvokeEventSub<EscapeJsonMessage, EscapeJsonResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: EscapeJsonMessage
  ): Promise<EscapeJsonResponse> {
    if (request.unescape) {
      return JsonEscaper.unescapeJson(request.data)
    }

    return JsonEscaper.escapeJson(request.data)
  }
}
