/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { LoadLicensingChannelPub } from './LoadLicensingChannelPub'
import { LicenseDataDto } from '../models/LicenseDataDto'
import { PaidLicensingService } from '../services/paidLicencingService'
import { useStoreLicence } from '../buildSettings'
import { StoreLicensingService } from '../services/storeLicencingService'

export class LoadLicensingChannelSub
  extends LoadLicensingChannelPub
  implements IIpcMainInvokeEventSub<void, LicenseDataDto>
{
  async handle(event: IpcMainEvent): Promise<LicenseDataDto> {
    if (useStoreLicence) {
      const data = await StoreLicensingService.getCurrentLicenseState()
      return data
    }
    const data = await PaidLicensingService.getCurrentLicenseState()
    return data
  }
}
