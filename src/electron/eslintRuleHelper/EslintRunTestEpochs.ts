/* eslint-disable @typescript-eslint/no-unused-vars */
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import { EslintRuleChatGptService } from './EslintRuleChatGptService'
import runTest from './EslintRunSingleTest'
import { EslintRuleEpoch } from './models/EslintRuleEpoch'
import EslintRuleTestingError, {
  ErrorSource,
} from './models/EslintRuleTestingError'
// prettier-ignore
const sampleCode = `import {
    RuleContext,
    RuleListener,
  } from '@typescript-eslint/utils/dist/ts-eslint'
  import {
    ESLintUtils,
    ASTUtils,
    AST_NODE_TYPES,
    AST_TOKEN_TYPES,
    ParserServices,
    TSESTree,
    TSESLint,
  } from '@typescript-eslint/utils'
  const dissallowZebraClass = 'dissallowZebraClass';

function hasZebra(word: string): boolean {
return word.includes('Zebra');
}

const rule = ESLintUtils.RuleCreator.withoutDocs({
defaultOptions: [],
meta: {
type: 'problem',
docs: {
  description: 'Disallow class names that include the word "Zebra"',
  recommended: true,
},
schema: [],
messages: {
  [dissallowZebraClass]: 'Class names cannot include the word "Zebra"',
},
},

create(context: Readonly<TSESLint.RuleContext<'dissallowZebraClass', []>>) {
function checkNodeForZebra(node: TSESTree.Node): void {
  if (node.type === AST_NODE_TYPES.ClassDeclaration) {
    const className = node.id?.name;
    if (className && hasZebra(className)) {
      context.report({
        node,
        messageId: dissallowZebraClass,
      });
    }
  }
}

return {
  [AST_NODE_TYPES.ClassDeclaration]: checkNodeForZebra,
};
},
});

export default rule;`

// async function runTestEpochsOld(
//   ruleMeta: EslintRuleGeneratorMeta,
//   options: {
//     openAiApiKey: string
//     tmpCodeFilePath: string
//   }
// ): Promise<EslintRuleEpoch[]> {
//   // start a docker container and run docker
//   await runTest(
//     sampleCode,
//     ruleMeta,
//     options.tmpCodeFilePath,
//     options.openAiApiKey
//   )
//   return []
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function runTestEpochs(
  ruleMeta: EslintRuleGeneratorMeta,
  options: {
    openAiApiKey: string
    tmpCodeFilePath: string
  }
): Promise<EslintRuleEpoch[]> {
  // rule tester gen initial message
  const chatMessages = EslintRuleChatGptService.getInitialChatMessages(ruleMeta)

  let lastGeneratedCode = await EslintRuleChatGptService.runChatCompletion(
    chatMessages,
    {
      openAIApiKey: options.openAiApiKey,
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
        options.tmpCodeFilePath,
        options.openAiApiKey
      )
      isSuccessful = true
    } catch (error) {
      const errorSource: ErrorSource =
        (error as EslintRuleTestingError)?.source || 'system'
      const errorMessage = (error as Error).message.slice(0, 500)
      // check if we want to rerun the generation

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
          openAIApiKey: options.openAiApiKey,
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
