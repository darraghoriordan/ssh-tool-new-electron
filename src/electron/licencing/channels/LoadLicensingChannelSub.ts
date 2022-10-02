/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { LoadLicensingChannelPub } from './LoadLicensingChannelPub'
import { LicenseDataDto } from '../models/LicenseDataDto'
import { PaidLicensingService } from '../services/paidLicencingService'

export class LoadLicensingChannelSub
  extends LoadLicensingChannelPub
  implements IIpcMainInvokeEventSub<void, LicenseDataDto>
{
  async handle(event: IpcMainEvent): Promise<LicenseDataDto> {
    const data = await PaidLicensingService.getCurrentLicenseState()
    return data
  }
}
