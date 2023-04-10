import { Configuration, OpenAIApi } from 'openai'
import { UserSettingsService } from '../userSettings/services/UserSettingsService'
import { ChatMessage } from './models/ChatMessage'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'

export class EslintRuleChatGptService {
  static hasSetApiKeys = async (): Promise<boolean> => {
    const settings = await UserSettingsService.getSettings()
    return (
      settings.openApiOrgId !== undefined &&
      settings.openApiOrgId.length > 0 &&
      settings.openApiChatGptKey !== undefined &&
      settings.openApiOrgId.length > 0
    )
  }
  static async runChatCompletion(
    messages: ChatMessage[],
    options: { openAIApiKey: string }
  ): Promise<{
    responseText: string
    tokensUsed: number
    finishReason?: string
  }> {
    const configuration = new Configuration({
      apiKey: options.openAIApiKey,
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    })

    const extractedText = completion.data.choices[0].message?.content
    if (extractedText === undefined) {
      throw new Error('Could not extract text from completion')
    }
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
    let extractedTextWithoutMarkdown = extractedText
      .replace(/```typescript/, '')
      .replace(/```/g, '')
    let containsTypescriptEslintImports = true
    while (containsTypescriptEslintImports) {
      // can't make this global regex because it will remove all imports so it's messy as hell
      containsTypescriptEslintImports =
        /import[\s.*][\w*{}\n\r\t, ]+[\s*]from[\s*]["']@typescript-eslint.*[\w]+["']?[;]?/i.test(
          extractedTextWithoutMarkdown
        )
      if (!containsTypescriptEslintImports) {
        break
      }
      extractedTextWithoutMarkdown = extractedTextWithoutMarkdown
        .replace(
          /import[\s.*][\w*{}\n\r\t, ]+[\s*]from[\s*]["']@typescript-eslint.*[\w]+["']?[;]?/i,
          ''
        )
        .trim()
      console.log('removed import...')
      // check if any imports left
    }

    return {
      tokensUsed: completion.data.usage?.total_tokens || 0,
      finishReason: completion.data.choices[0].finish_reason,
      responseText: (fullTsEslintImports + extractedTextWithoutMarkdown)

        // find the first const rule = and remove everything before it (imports)
        //.replace(/[\s\S]*?(?=const)/, '')
        .trim(),
    }
  }

  static getInitialChatMessages = (
    meta: EslintRuleGeneratorMeta
  ): ChatMessage[] => {
    const st = `
    const rule = ESLintUtils.RuleCreator.withoutDocs({
        defaultOptions: [],
        meta: {
          type: 'suggestion',
          docs: {
            description: string,
            recommended: false,
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
    An example template would be:
    \`\`\`
    ${st}
    \`\`\`
    The ESLint rule should ensure that the following criteria are met: ${meta.criteria
      .map((c, i) => `${i + 1}. ${c}.`)
      .join('\n')}
      Examples of code that should pass without errors:
      \`\`\`
      ${meta.passingExamples.join('\n')}
      \`\`\`
      Examples of code that should be caught by the eslint rule:
      \`\`\`
      ${meta.failingExamples.join('\n')}
      \`\`\`
      When raising an error, only use the following message Ids:
      \`\`\`
      ${distinctErrorMessageIds.join('\n')}
      \`\`\`
      Write any additional helper functions you need in the rule.
      Only respond with code.
      You must use "ESLintUtils.RuleCreator.withoutDocs".
      You must complete the rule with an "export default rule" statement.`

    console.log('message', message)
    const messageHistory: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert typescript abstract syntax tree developer. You are writing an eslint rule withoutDocs in typescript.
          Think through it step by step.
          Do not explain any code with english. Do not apologise. Only response with code.`,
      },
      {
        role: 'user',
        content: message,
      },
    ]
    return messageHistory
  }
}
