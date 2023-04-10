import path from 'path'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import runTestEpochs from './EslintRunTestEpochs'
import EslintRuleGenerationRecord from './models/EslintRuleGeneration'

// this cannot run in the context of a test framework because it's a test itself
// it must be called by node directly
const runSampleTest = async () => {
  const ruleMeta: EslintRuleGeneratorMeta = {
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
    openApiApiKey: '',
    tmpCodeFilePath: path.join(__dirname, 'tmp-file.ts'),
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
