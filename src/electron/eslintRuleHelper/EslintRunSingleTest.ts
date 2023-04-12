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
    console.log('Docker Test Feedback', { testFeedback })
  } catch (error) {
    const message = sanitizeErrorMessage((error as Error).message)
    // running the docker command throws rather than return stderr
    throwOnTypescriptError(message)
    throwOnEslintTestError(message)
    console.debug('no fixable error found - throwing system error', {
      message: message,
    })
    throw new EslintRuleTestingError(message, 'system', false)
  }
}

export const sanitizeErrorMessage = (message: string): string => {
  message = message.replace(/OPEN_API_CHAT_GPT_KEY.*-v/g, '-v')
  // remove the whole docker command in case it confuses the chat gpt
  message = message.replace(/docker[\s\S]*:latest/m, '')
  // remove everything from messge up to "AssertionError"
  message = message.replace(/[\s\S]*?AssertionError/gm, 'AssertionError')
  return message
}
export const throwOnEslintTestError = (message: string): void => {
  if (message.includes('AssertionError')) {
    throw new EslintRuleTestingError(message, 'eslint-test', true)
  }
  console.debug('no eslint test error found', { message: message })
}
export const throwOnTypescriptError = (message: string): void => {
  const typescriptErrorNumberMatcher = /error TS\d{4}/g
  if (typescriptErrorNumberMatcher.test(message)) {
    throw new EslintRuleTestingError(message, 'tsc', true)
  }
  console.debug('no typescript error found', { message: message })
}
export default runTest
