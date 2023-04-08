import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { EslintRuleHelperChannelPub } from './EslintRuleGeneratorChannelPub'
import runTestEpochs from '../EslintRunTestEpochs'
import EslintRuleGeneratorMeta from '../models/EslintRuleGeneratorMeta'
import EslintRuleGenerationRecord from '../models/EslintRuleGeneration'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'

export class EslintRuleHelperChannelSub
  extends EslintRuleHelperChannelPub
  implements
    IIpcMainInvokeEventSub<EslintRuleGeneratorMeta, EslintRuleGenerationRecord>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: EslintRuleGeneratorMeta
  ): Promise<EslintRuleGenerationRecord> {
    const settings = await UserSettingsService.getSettings()
    const generationRecord = new EslintRuleGenerationRecord()
    generationRecord.meta = request
    if (settings.openApiChatGptKey === undefined) {
      throw new Error('no openApiChatGptKey')
    }
    for await (const e of runTestEpochs(request, {
      openApiApiKey: settings.openApiChatGptKey,
    })) {
      generationRecord.epochs.push(e)
    }
    return generationRecord
  }
}
