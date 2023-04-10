import { IpcMainEvent, app } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import EslintRuleGenerationRecord from '../models/EslintRuleGeneration'
import path from 'path'
import fs from 'fs/promises'
import { GetPastGenerationChannelPub } from './GetPastGenerationChannelPub'

export class GetPastGenerationChannelSub
  extends GetPastGenerationChannelPub
  implements IIpcMainInvokeEventSub<string, EslintRuleGenerationRecord>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: string
  ): Promise<EslintRuleGenerationRecord> {
    // save the record to file system
    const fileContents = await fs.readFile(
      path.join(
        app.getPath('userData'),
        'eslint-generations',
        `${request}.json`
      )
    )
    return JSON.parse(
      fileContents.toString()
    ) as unknown as EslintRuleGenerationRecord
  }
}
