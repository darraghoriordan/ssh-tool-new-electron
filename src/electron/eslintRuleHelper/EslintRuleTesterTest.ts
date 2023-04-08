import path from 'path'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import runTestEpochs from './EslintRunTestEpochs'
import EslintRuleGenerationRecord from './models/EslintRuleGeneration'
import util from 'util'
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
    tmpCodeFilePath: path.join(__dirname, 'tmp-file.ts'),
  }
  const generationRecord = new EslintRuleGenerationRecord()
  generationRecord.meta = ruleMeta

  for await (const e of runTestEpochs(ruleMeta, {
    openApiApiKey: '',
  })) {
    console.log('latest epoch', util.inspect(e, true, 6))
  }
}

runSampleTest()
  .then(result => {
    console.log('done', { result })
  })
  .catch(e => {
    console.error('error', e)
  })
