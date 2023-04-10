import { InvokeChannelBasePub } from '../../IpcChannelTypes/InvokeChannelBasePub'
import { ColorConverterChannels } from './ColorConverterChannelEnum'

export class ColorConverterChannelPub extends InvokeChannelBasePub {
  constructor() {
    super('ColorConverter', ColorConverterChannels.CONVERT_COLOR)
  }
}
