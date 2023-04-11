import { IpcMainEvent, app } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { EslintRuleHelperChannelPub } from './EslintRuleGeneratorChannelPub'
import runTestEpochs from '../EslintRunTestEpochs'
import EslintRuleGeneratorMeta from '../models/EslintRuleGeneratorMeta'
import EslintRuleGenerationRecord from '../models/EslintRuleGeneration'
import { UserSettingsService } from '../../userSettings/services/UserSettingsService'
import path from 'path'
import fsp from 'fs/promises'
import fs from 'fs'

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
    const dirPath = path.join(app.getPath('userData'), 'eslint-test-build')
    if (!fs.existsSync(dirPath)) {
      console.log('creating dir', dirPath)
      fs.mkdirSync(dirPath, {
        recursive: true,
      })
      //   fs.writeFileSync(
      //     path.join(dirPath, 'package.json'),
      //     `{
      //     "name": "eslint-test-build",
      //     "private": true,
      //     "version": "1.0.0",
      //     "description": "Local offline tools for developers",
      //     "scripts": {
      //       "start": "electron-forge start"
      //      },
      //     "dependencies": {
      //       "@types/eslint": "8.37.0",
      //       "@types/node": "18.15.11",
      //       "@typescript-eslint/eslint-plugin": "5.57.1",
      //       "@typescript-eslint/parser": "5.57.1",
      //       "eslint": "8.37.0",
      //       "ts-jest": "29.1.0",
      //       "ts-loader": "9.4.2",
      //       "ts-node": "10.9.1",
      //       "typescript": "4.9.5"
      //     }
      //   }`
      //   )
      //   fs.writeFileSync(
      //     path.join(dirPath, 'tsconfig.json'),
      //     `{
      //     "compilerOptions": {
      //         "jsx": "preserve",
      //         "target": "es5",
      //         "module": "commonjs",
      //         "strict": true,
      //         "esModuleInterop": true,
      //         "lib": [
      //             "es2015",
      //             "es2017",
      //             "esnext"
      //         ],
      //         "experimentalDecorators": true,
      //         // "typeRoots": [
      //         //     "node_modules/@types",
      //         //     "../"
      //         // ],
      //     },
      //     "include": [
      //         "file.ts",
      //         "./**/*.ts"
      //     ],
      //     "exclude": [
      //         "dist",
      //         "src"
      //     ]
      // }`
      //   )
    }

    generationRecord.epochs = await runTestEpochs(request, {
      openAiApiKey: settings.openApiChatGptKey,
      tmpCodeFilePath: dirPath,
    })
    // save the record to file system
    await fsp.writeFile(
      path.join(
        app.getPath('userData'),
        'eslint-generations',
        `${generationRecord.createdForFilename}.json`
      ),
      JSON.stringify(generationRecord)
    )
    return generationRecord
  }
}
