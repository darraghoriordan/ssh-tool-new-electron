import { throwOnTypescriptError } from './EslintRunSingleTest'
import EslintRuleTestingError from './models/EslintRuleTestingError'

describe('EslintRunSingleTest', () => {
  let thrownError: EslintRuleTestingError
  it('throws typescript error ', () => {
    const message = ` Command failed: && docker run -e -v "/Users/darraghoriordan/Library/Application Support/LocalDevTools/eslint-test-build:/app/usr" darraghoriordan/ldt-eslint:latest [31musr/ldt-eslint-tmp-code-file.ts(14,40): error TS2307: Cannot find module './utils' or its corresponding type declarations. usr/ldt-eslint-tmp-code-file.ts(45,49): error TS2694: Namespace '"/app/node_modules/@typescript-eslint/types/dist/generated/ast-spec"' has no exported member 'ClassProperty'. usr/ldt-eslint-tmp-code-file.ts(`
    try {
      throwOnTypescriptError(message)
    } catch (error) {
      thrownError = error as EslintRuleTestingError
    }

    expect(thrownError).toBeDefined()
    expect(thrownError.message).toEqual(message)
    expect(thrownError.source).toEqual('tsc')
  })
})
