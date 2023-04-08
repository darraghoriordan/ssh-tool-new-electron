import { ESLintUtils } from '@typescript-eslint/utils'
import path from 'path'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'

class EslintRuleTester {
  public static async testOutput(options: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    code: any
    ruleMeta: EslintRuleGeneratorMeta
  }): Promise<string> {
    const configPathRoot = path.join(__dirname, 'test-fixtures')

    const ruleTester = new ESLintUtils.RuleTester({
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module',
        tsconfigRootDir: configPathRoot,
        project: 'tsconfig.json',
      },
    })
    try {
      ruleTester.run('all-properties-have-explicit-defined', options.code, {
        valid: options.ruleMeta.passingExamples.map(e => {
          return { code: e }
        }),
        invalid: options.ruleMeta.failingExamples.map(e => {
          return {
            code: e.code,
            errors: [
              {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                messageId: e.errorMessageId,
              },
            ],
          }
        }),
      })
      return ''
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (error as any).toString()
    }
  }
}

export default EslintRuleTester
