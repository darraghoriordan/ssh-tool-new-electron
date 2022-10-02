/* eslint-disable @typescript-eslint/no-unused-vars */
import { app, IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { LicenseDataDto } from '../models/LicenseDataDto'
import { PaidLicensingService } from '../services/paidLicencingService'
import { SetLicenseKeyChannelPub } from './SetLicenceKeyChannelPub'

export type SetLicenseKeyRequest = {
  licenseKey: string
}

export class SetLicenseKeyChannelSub
  extends SetLicenseKeyChannelPub
  implements IIpcMainInvokeEventSub<SetLicenseKeyRequest, LicenseDataDto>
{
  async handle(
    event: IpcMainEvent,
    request: SetLicenseKeyRequest
  ): Promise<LicenseDataDto> {
    const data = await PaidLicensingService.setLicenseKey(request.licenseKey)
    return data
  }
}
