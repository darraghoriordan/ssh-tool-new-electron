import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { JwtDecoder } from '../jwtDecoderService'
import { DecodeJwtChannelPub } from './DecodeJwtChannelPub'
import { DecodeJwtMessage, DecodeJwtResponse } from './MessageTypes'

export class DecodeJwtChannelSub
  extends DecodeJwtChannelPub
  implements IIpcMainInvokeEventSub<DecodeJwtMessage, DecodeJwtResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: DecodeJwtMessage
  ): Promise<DecodeJwtResponse> {
    console.log('Decoding jwt...', request)
    const result = JwtDecoder.decode(request.jwt)
    console.log('Decoded jwt', result)
    return result
  }
}
