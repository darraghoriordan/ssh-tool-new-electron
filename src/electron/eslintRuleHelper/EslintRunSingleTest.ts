import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import EslintRuleTester from './EslintRuleTester'
import fs from 'fs'

const runTest = async (
  code: string,
  ruleMeta: EslintRuleGeneratorMeta
): Promise<void> => {
  // write the response to a file so the code can be imported and parsed dynamically
  fs.writeFileSync(ruleMeta.tmpCodeFilePath, code)

  const ruleModule = await import(ruleMeta.tmpCodeFilePath)

  const testFeedback = await EslintRuleTester.testOutput({
    code: ruleModule.default,
    ruleMeta,
  })
  if (testFeedback !== '') {
    throw new Error(testFeedback)
  }
}
export default runTest
