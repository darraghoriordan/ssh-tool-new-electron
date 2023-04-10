import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import EslintRuleTestingError from './models/EslintRuleTestingError'
import { DockerfileHelper } from './DockerFileHelper'

const runTest = async (
  code: string,
  ruleMeta: EslintRuleGeneratorMeta,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tmpCodeFilePath: string,
  openAIApiKey: string
): Promise<void> => {
  try {
    const dHelper = new DockerfileHelper()

    const testFeedback = await dHelper.runDocker(ruleMeta, code, {
      tmpCodeFilePath,
      openAiApiKey: openAIApiKey,
    })
    if (testFeedback !== '') {
      throw new EslintRuleTestingError(testFeedback, 'eslint-test')
    }
  } catch (error) {
    throw new EslintRuleTestingError((error as Error).message, 'eslint-test')
  }
}
export default runTest
