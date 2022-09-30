import { IpcMainEvent } from 'electron'
import { IIpcMainSendEventSub } from '../../IpcChannelTypes/IIpcMainSendEventSub'
import { ApplicationSettingService } from '../services/ApplicationSettingService'
import { SetFirstAppUsageDatePub } from './SetFirstAppUsageDatePub'

export class SetFirstAppUsageDateSub
  extends SetFirstAppUsageDatePub
  implements IIpcMainSendEventSub<void>
{
  async handle(event: IpcMainEvent, message: void): Promise<void> {
    console.log('SetFirstAppUsageDate.handle', message)

    const settings = await ApplicationSettingService.getSettings()
    if (settings.storedApplicationSettings.firstRunDate !== undefined) {
      throw new Error("Attempt to set first run date when it's already set")
    }
    settings.storedApplicationSettings.firstRunDate = new Date()

    await ApplicationSettingService.saveFile(settings.storedApplicationSettings)
  }
}
