import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import { EslintRuleChatGptService } from './EslintRuleChatGptService'
import runTest from './EslintRunSingleTest'
import { EslintRuleEpoch } from './models/EslintRuleEpoch'
import EslintRuleTestingError, {
  ErrorSource,
} from './models/EslintRuleTestingError'

async function runTestEpochs(
  ruleMeta: EslintRuleGeneratorMeta,
  options: {
    openApiApiKey: string
    tmpCodeFilePath: string
  }
): Promise<EslintRuleEpoch[]> {
  // rule tester gen initial message
  const chatMessages = EslintRuleChatGptService.getInitialChatMessages(ruleMeta)

  let lastGeneratedCode = await EslintRuleChatGptService.runChatCompletion(
    chatMessages,
    {
      openAIApiKey: options.openApiApiKey,
    }
  )

  let currentEpoch = 1
  const allEpochs: EslintRuleEpoch[] = []
  let isSuccessful = false
  while (currentEpoch < ruleMeta.maxNumberOfEpochs && !isSuccessful) {
    const epochRecord = new EslintRuleEpoch(
      currentEpoch,
      lastGeneratedCode.responseText,
      lastGeneratedCode.tokensUsed
    )
    epochRecord.chatMessages = [...chatMessages]
    try {
      await runTest(
        lastGeneratedCode.responseText,
        ruleMeta,
        options.tmpCodeFilePath
      )
      isSuccessful = true
    } catch (error) {
      let errorSource: ErrorSource = 'system'
      let errorMessage = 'Unknown error'
      if (error instanceof EslintRuleTestingError) {
        errorMessage = error.message.slice(0, 500)
        errorSource = error.source
      } else {
        errorMessage = (error as Error).message.slice(0, 500)
      }

      epochRecord.errors.push({
        message: errorMessage,
        source: errorSource,
      })
      chatMessages.push({
        role: 'assistant',
        content: '```' + lastGeneratedCode.responseText + '```',
      })
      chatMessages.push({
        role: 'user',
        content: `There is an error with the previous code, can you fix it? The error is: ${errorMessage}

        Do not apologize or explain. Only return the code that fixes the error.`,
      })
      lastGeneratedCode = await EslintRuleChatGptService.runChatCompletion(
        chatMessages,
        {
          openAIApiKey: options.openApiApiKey,
        }
      )
    }

    allEpochs.push(epochRecord)
    currentEpoch++

    if (
      epochRecord.errors?.length > 0 &&
      epochRecord.errors[0].source === 'system'
    ) {
      // something went wrong with the system, so we should stop wasting tokens
      break
    }
  }
  console.log('returning all epochs', { allEpochs })
  return allEpochs
}

export default runTestEpochs
