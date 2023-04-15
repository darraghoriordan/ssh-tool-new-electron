/* eslint-disable @typescript-eslint/no-unused-vars */
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import {
  ChatGptCompletionResponse,
  EslintRuleChatGptService,
} from './EslintRuleChatGptService'
import runTest from './EslintRunSingleTest'
import { EslintRuleEpoch } from './models/EslintRuleEpoch'
import fsp from 'fs/promises'
import fs from 'fs'
import path from 'path'

import EslintRuleTestingError, {
  ErrorSource,
} from './models/EslintRuleTestingError'
import EslintRuleGenerationRecord from './models/EslintRuleGeneration'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runTestEpochs(
  ruleMeta: EslintRuleGeneratorMeta,
  options: {
    openAiApiKey: string
    tmpCodeFilePath: string
    generationFileStorePath: string
  }
): Promise<EslintRuleEpoch[]> {
  const generationRecord = new EslintRuleGenerationRecord(ruleMeta)

  if (!fs.existsSync(options.generationFileStorePath)) {
    console.log('creating dir', options.generationFileStorePath)
    fs.mkdirSync(options.generationFileStorePath, {
      recursive: true,
    })
  }
  if (!fs.existsSync(options.tmpCodeFilePath)) {
    console.log('creating dir', options.tmpCodeFilePath)
    fs.mkdirSync(options.tmpCodeFilePath, {
      recursive: true,
    })
  }

  // rule tester gen initial message
  const chatMessages = EslintRuleChatGptService.getInitialChatMessages(ruleMeta)

  let lastGeneratedCode: ChatGptCompletionResponse = {
    responseText: '',
    tokensUsed: 0,
    finishReason: undefined,
  }

  let currentEpoch = 0

  let isSuccessful = false
  while (currentEpoch < ruleMeta.maxNumberOfEpochs && !isSuccessful) {
    generationRecord.epochs[currentEpoch] = new EslintRuleEpoch(
      currentEpoch + 1,
      '',
      0
    )
    generationRecord.epochs[currentEpoch].chatMessages = [...chatMessages]
    // save a placeholder to show progress
    await saveGeneration(generationRecord, options.generationFileStorePath)
    try {
      // this should (almost) always return something
      lastGeneratedCode = await EslintRuleChatGptService.runChatCompletion(
        chatMessages,
        {
          openAIApiKey: options.openAiApiKey,
        }
      )
      // update the epoch progress
      generationRecord.epochs[currentEpoch].code =
        lastGeneratedCode.responseText
      generationRecord.epochs[currentEpoch].tokensUsed =
        lastGeneratedCode.tokensUsed
      await saveGeneration(generationRecord, options.generationFileStorePath)
      // if there was a chat gpt error, throw it now
      if (lastGeneratedCode.errorMessage) {
        throw new EslintRuleTestingError(
          lastGeneratedCode.errorMessage,
          'chat-gpt',
          false
        )
      }

      await runTest(
        lastGeneratedCode.responseText,
        ruleMeta,
        options.tmpCodeFilePath,
        options.openAiApiKey
      )
      generationRecord.epochs[currentEpoch].completed = true
      await saveGeneration(generationRecord, options.generationFileStorePath)
      isSuccessful = true
    } catch (error) {
      const consistentError = convertAllErrorsToEslintRuleTestingError(error)
      generationRecord.epochs[currentEpoch].errors.push(consistentError)
      generationRecord.epochs[currentEpoch].completed = true
      await saveGeneration(generationRecord, options.generationFileStorePath)

      // check if something is not recoverable, if so, break the loop
      if (
        generationRecord.epochs[currentEpoch].errors?.length > 0 &&
        generationRecord.epochs[currentEpoch].errors?.some(
          e => e.recoverable === false
        )
      ) {
        break
      }

      // prepare for the next loop
      chatMessages.push({
        role: 'assistant',
        content: '```' + lastGeneratedCode.responseText + '```',
      })
      chatMessages.push({
        role: 'user',
        content: `There is an error with the previous code, can you fix it? The error is: ${consistentError.message}

        Important: Do not apologize or explain. Only return the full code with the error fixed.`,
      })
    }
    currentEpoch++
  }

  return generationRecord.epochs
}

export default runTestEpochs

export const saveGeneration = async (
  generationRecord: EslintRuleGenerationRecord,
  generationFileStorePath: string
) => {
  const filePath = path.join(
    generationFileStorePath,
    generationRecord.createdForFilename + '.json'
  )

  // save the record to file system
  await fsp.writeFile(filePath, JSON.stringify(generationRecord))
}

export const convertAllErrorsToEslintRuleTestingError = (error: unknown) => {
  const errorSource: ErrorSource =
    (error as EslintRuleTestingError)?.source || 'system'
  const recoverableError =
    (error as EslintRuleTestingError)?.recoverable || false
  const errorMessage = (error as Error).message.slice(0, 800)

  return {
    message: errorMessage,
    name: (error as Error).name,
    recoverable: recoverableError,
    source: errorSource,
  }
}
