/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAI } from 'openai'
import { UserSettingsService } from '../userSettings/services/UserSettingsService'
import { ChatMessage } from '../openai/ChatMessage'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'

export type ChatGptCompletionResponse = {
  responseText: string
  tokensUsed: number
  finishReason?: string
  errorMessage?: string
}

export class EslintRuleChatGptService {
  static hasSetApiKeys = async (): Promise<boolean> => {
    const settings = await UserSettingsService.getSettings()
    return (
      settings.openAiOrgId !== undefined &&
      settings.openAiOrgId.length > 0 &&
      settings.openAiChatGptKey !== undefined &&
      settings.openAiOrgId.length > 0
    )
  }

  static cleanChatGptResponse = (text: string): string => {
    // chatgpt is terrible with import statements. so lets just add very broad ones to the top of the file
    // and remove any imports added by chatgpt
    const fullTsEslintImports = `
    import {
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
      `
    // remove any markdown added by chatgpt
    let extractedTextWithoutMarkdown = text
      .replace(/```typescript/, '')
      .replace(/```/g, '')

    // now remove any dodgy import statements added by chatgpt
    let containsTypescriptEslintImports = true
    while (containsTypescriptEslintImports) {
      // can't make this global regex because it will remove all imports so it's messy as hell
      containsTypescriptEslintImports =
        /import[\s.*][\w*{}\n\r\t, ]+[\s*]from[\s*]["']@typescript-eslint.*[\w]+["']?[;]?/i.test(
          extractedTextWithoutMarkdown,
        )
      if (!containsTypescriptEslintImports) {
        break
      }
      extractedTextWithoutMarkdown = extractedTextWithoutMarkdown
        .replace(
          /import[\s.*][\w*{}\n\r\t, ]+[\s*]from[\s*]["']@typescript-eslint.*[\w]+["']?[;]?/i,
          '',
        )
        .trim()
      console.log('removed import...')
      // check if any imports left
    }
    return (fullTsEslintImports + extractedTextWithoutMarkdown).trim()
  }

  static async runChatCompletion(
    messages: ChatMessage[],
    options: { openAIApiKey: string },
  ): Promise<ChatGptCompletionResponse> {
    const openai = new OpenAI({
      apiKey: options.openAIApiKey,
    })
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
      })

      const extractedText = completion.choices[0].message?.content
      if (extractedText === undefined) {
        throw new Error('Could not extract text from completion')
      }

      return {
        tokensUsed: completion.usage?.total_tokens || 0,
        finishReason: completion.choices[0].finish_reason,
        responseText: this.cleanChatGptResponse(extractedText || ''),
      }
    } catch (error) {
      // try not to throw from here. makes the path easier to follow in callers
      // the http library will throw on 400s from cat gpt but these are handlable errors
      const finishReason = (error as any)?.data?.choices?.[0]?.finish_reason
      const tokensUsed = (error as any)?.data?.usage?.total_tokens || 0
      let errorMessage = (error as Error).message
      if (errorMessage.includes('400')) {
        errorMessage = `${errorMessage}: This usually means that we have exceeded the maximum number of tokens for the api. Or your api key is invalid.`
      }
      return {
        tokensUsed: tokensUsed,
        finishReason,
        responseText: '',
        errorMessage,
      }
    }
  }

  static getInitialChatMessages = (
    meta: EslintRuleGeneratorMeta,
  ): ChatMessage[] => {
    const st = `
    const rule = {
        defaultOptions: [],
        meta: {
          type: 'suggestion' as const,
          docs: {
            description: string,
            recommended: false as const,
          },
          schema: [],
          messages: {},
        },

        create(context: Readonly<TSESLint.RuleContext<'messageId', []>>) {
           // implementation
        },
      })
    `
    // get a list of distinct error message ids
    const distinctErrorMessageIds = meta.failingExamples
      .map(x => x.errorMessageId)
      .filter((v, i, a) => a.indexOf(v) === i)

    const message = `Write an eslint rule in typescript that meets the following criteria. Do not explain the rule.
    The rule should return an object. An example template for a rule is:
    \`\`\`
    ${st}
    \`\`\`
    Do not use "createRule" or other helper functions. Write the rule from scratch.
    The ESLint rule should ensure that the following criteria are met: ${meta.criteria
      .map((c, i) => `${i + 1}. ${c}.`)
      .join('\n')}
      Examples of code that should pass without errors:
      \`\`\`
      ${meta.passingExamples.join('\n\n')}
      \`\`\`
      Examples of code that should be caught by the eslint rule:
      \`\`\`
      ${meta.failingExamples.map(e => e.code).join('\n\n')}
      \`\`\`
      When raising an error, only use the following message Ids:
      \`\`\`
      ${distinctErrorMessageIds.join('\n')}
      \`\`\`
      Write any additional helper functions you need in the rule.
      Only respond with code. Never apologize or explain your code.
      You must complete the rule with an "export default rule" statement.`

    console.log('message', message)
    const messageHistory: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert typescript abstract syntax tree developer. You are writing an eslint rule withoutDocs in typescript.
          Think through it step by step.
          Do not explain any code with english. Never apologize for errors. Only response with working code.`,
      },
      {
        role: 'user',
        content: message,
      },
    ]
    return messageHistory
  }
}
