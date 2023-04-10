import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { ColorConverter } from '../ColorConverterService'
import { ColorConverterChannelPub } from './ColorConverterChannelPub'
import { ColorConverterMessage, ColorConverterResponse } from './MessageTypes'

export class ColorConverterChannelSub
  extends ColorConverterChannelPub
  implements
    IIpcMainInvokeEventSub<ColorConverterMessage, ColorConverterResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: ColorConverterMessage
  ): Promise<ColorConverterResponse> {
    return ColorConverter.convert(request)
  }
}
