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
    console.log('testFeedback', { testFeedback })
  } catch (error) {
    let message = (error as Error).message
    // sanitise the gpt key
    message = message.replace(/OPEN_API_CHAT_GPT_KEY.*-v/g, '-v')
    // remove the whole docker command in case it confuses the chat gpt
    message = message.replace(/docker[\s\S]*?eslint-tester:latest/m, '')
    // remove everything from messge up to "AssertionError"
    message = message.replace(/[\s\S]*?AssertionError/gm, 'AssertionError')

    const typescriptErrorNumberMatcher = /error TS\d{4}/g
    // running the docker command throws rather than return stderr
    if (typescriptErrorNumberMatcher.test(message)) {
      throw new EslintRuleTestingError(message, 'tsc')
    }
    if (message.includes('AssertionError')) {
      throw new EslintRuleTestingError(message, 'eslint-test')
    }
    throw new EslintRuleTestingError(message, 'system')
  }
}
export default runTest
