import runTestEpochs from './EslintRunTestEpochs'

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
    requestDate: new Date(),
  }

  const epochs = await runTestEpochs(ruleMeta, {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    openAiApiKey: process.env.OPEN_API_CHAT_GPT_KEY!,
    generationFileStorePath:
      '/Users/darraghoriordan/Library/Application Support/LocalDevTools/eslint-generations',
    tmpCodeFilePath:
      '/Users/darraghoriordan/Library/Application Support/LocalDevTools/eslint-test-build',
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
