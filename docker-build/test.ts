import { ESLintUtils } from '@typescript-eslint/utils'
import EslintRuleGeneratorMeta from './EslintRuleGeneratorMeta'
import fs from 'fs'
import rule from './usr/ldt-eslint-tmp-code-file'

export const testOutput = async (options: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: any
  ruleMeta: EslintRuleGeneratorMeta
}): Promise<string> => {
  const ruleTester = new ESLintUtils.RuleTester({
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: './tsconfig.json',
    },
  })

  ruleTester.run('eslint-tester-rule', options.code, {
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
}

const meta = JSON.parse(fs.readFileSync('/app/usr/ruleMeta.json', 'utf8'))
console.log('meta', { meta })
testOutput({
  code: rule,
  ruleMeta: meta,
})
