import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import { EslintRuleChatGptService } from './EslintRuleChatGptService'
import runTest from './EslintRunSingleTest'
import { EslintRuleEpoch } from './models/EslintRuleEpoch'

async function* runTestEpochs(
  ruleMeta: EslintRuleGeneratorMeta,
  options: {
    openApiApiKey: string
  }
): AsyncGenerator<EslintRuleEpoch, EslintRuleEpoch[], void> {
  // rule tester gen initial message
  const chatMessages =
    EslintRuleChatGptService.getEslintRuleGeneratorChatMessages(ruleMeta)

  let lastGeneratedCode = await EslintRuleChatGptService.addToChat(
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
      await runTest(lastGeneratedCode.responseText, ruleMeta)
      isSuccessful = true
    } catch (error) {
      const errorMessage = (error as Error).message.slice(0, 500)
      epochRecord.errors.push(errorMessage)
      chatMessages.push({
        role: 'assistant',
        content: '```' + lastGeneratedCode + '```',
      })
      chatMessages.push({
        role: 'user',
        content: `There is an error with the previous code, can you fix it? The error is: ${errorMessage}

        Do not apologize or explain. Only return the code that fixes the error.`,
      })
      lastGeneratedCode = await EslintRuleChatGptService.addToChat(
        chatMessages,
        {
          openAIApiKey: options.openApiApiKey,
        }
      )
    }

    allEpochs.push(epochRecord)

    yield epochRecord
    currentEpoch++
  }
  console.log('returning all epochs', { allEpochs })
  return allEpochs
}

export default runTestEpochs
