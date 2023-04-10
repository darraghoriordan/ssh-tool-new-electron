import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import EslintRuleTester from './EslintRuleTester'
import fs from 'fs'
import EslintRuleTestingError from './models/EslintRuleTestingError'
import path from 'path'
import exec from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec.exec)

const runTest = async (
  code: string,
  ruleMeta: EslintRuleGeneratorMeta,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tmpCodeFilePath: string
): Promise<void> => {
  const tmpPath = path.join(__dirname, 'tmp-file.ts')
  // write the response to a tmp file so the code can be imported and parsed dynamically
  fs.writeFileSync(tmpCodeFilePath, code)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ruleModule: any = undefined
  try {
    const tscResult = await execAsync(
      `tsc ldt-eslint-tmp-code-file.ts --outFile ldt-eslint-tmp-code-file.js --module system --moduleResolution nodenext`,
      {
        cwd: path.dirname(tmpCodeFilePath),
      }
    )
  } catch (error) {
    // ignore any tsc errors
  }
  try {
    // trim first / from path
    // const tmpCodeFilePathWithoutFirstSlash = tmpCodeFilePath.replace(/^\//, '')
    ruleModule = global.require(tmpCodeFilePath.replace(/.ts$/, '.js'))
    // ruleModule = await import(
    //   '/' + tmpCodeFilePathWithoutFirstSlash.replace(/.ts$/, '.js')
    // )
  } catch (error) {
    throw new EslintRuleTestingError((error as Error).message, 'tsc')
  }

  try {
    const testFeedback = await EslintRuleTester.testOutput({
      code: ruleModule.default,
      ruleMeta,
    })
    if (testFeedback !== '') {
      throw new EslintRuleTestingError(testFeedback, 'eslint-test')
    }
  } catch (error) {
    throw new EslintRuleTestingError((error as Error).message, 'eslint-test')
  }
}
export default runTest
