import { IpcMainEvent, app } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { EslintRuleHelperChannelPub } from './EslintRuleGeneratorChannelPub'
import runTestEpochs from '../EslintRunTestEpochs'
import EslintRuleGeneratorMeta from '../models/EslintRuleGeneratorMeta'
import EslintRuleGenerationRecord from '../models/EslintRuleGeneration'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
import path from 'path'

export class EslintRuleHelperChannelSub
  extends EslintRuleHelperChannelPub
  implements
    IIpcMainInvokeEventSub<EslintRuleGeneratorMeta, EslintRuleGenerationRecord>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: EslintRuleGeneratorMeta,
  ): Promise<EslintRuleGenerationRecord> {
    const settings = await UserSettingsService.getSettings()

    if (settings.openAiChatGptKey === undefined) {
      throw new Error('no openApiChatGptKey')
    }

    const tmpCodeWorkingDir = path.join(
      app.getPath('userData'),
      'eslint-test-build',
    )
    const generationFileStorePath = path.join(
      app.getPath('userData'),
      'eslint-generations',
    )
    // let this run but return to FE
    runTestEpochs(request, {
      openAiApiKey: settings.openAiChatGptKey,
      tmpCodeFilePath: tmpCodeWorkingDir,
      generationFileStorePath,
    })

    return new EslintRuleGenerationRecord(request)
  }
}
