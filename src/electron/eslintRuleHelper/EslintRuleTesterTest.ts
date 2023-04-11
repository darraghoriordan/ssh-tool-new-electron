import runTestEpochs from './EslintRunTestEpochs'
import EslintRuleGenerationRecord from './models/EslintRuleGeneration'
import path from 'path'
// this cannot run in the context of a test framework because it's a test itself
// it must be called by node directly
const runSampleTest = async () => {
  const ruleMeta = {
    criteria: ['disallow class names that include the word "Zebra"'],
    maxNumberOfEpochs: 6,
    passingExamples: [`class AAA {}`, `class BBB {}`],
    failingExamples: [
      { code: `class AZebraA {}`, errorMessageId: 'dissallowZebraClass' },
      { code: `class ZebraA {}`, errorMessageId: 'dissallowZebraClass' },
    ],
  }
  const generationRecord = new EslintRuleGenerationRecord()
  generationRecord.meta = ruleMeta

  const epochs = await runTestEpochs(ruleMeta, {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    openAiApiKey: process.env.OPEN_API_CHAT_GPT_KEY!,
    tmpCodeFilePath: path.join(
      '/Users/darraghoriordan/Library/Application Support/LocalDevTools/eslint-test-build',
      'ldt-eslint-tmp-code-file.ts'
    ), // container path
  })
  return epochs
}

runSampleTest()
  .then(result => {
    console.log('done', { result })
  })
  .catch(e => {
    console.error('error', e)
  })
