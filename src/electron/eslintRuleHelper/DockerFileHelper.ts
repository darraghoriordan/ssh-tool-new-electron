import fs from 'fs'
import path from 'path'
import exec from 'child_process'
import { promisify } from 'util'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
const execAsync = promisify(exec.exec)
// prettier-ignore
const testScript = `
import { ESLintUtils } from '@typescript-eslint/utils'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
import fs from 'fs'
import rule from '/app/ldt-eslint-tmp-code-file'

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
      tsconfigRootDir: './',
      project: 'tsconfig.json',
    },
  })
  try {
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
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (error as any).toString()
  }
}

const meta = JSON.parse(fs.readFileSync('/app/ruleMeta.json', 'utf8'))
testOutput({
  code: rule.default,
  ruleMeta: meta,
})`
const dockerFile =
  // prettier-ignore
  `FROM node:18-alpine as base
WORKDIR /app
RUN ls -la
RUN npm i
CMD ["ts-node", "test.ts"]
`
const packageJson =
  // prettier-ignore
  `{
    "name": "eslint-test-build",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \\"Error: no test specified\\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
      "@types/eslint": "8.37.0",
      "@typescript-eslint/eslint-plugin": "5.57.1",
      "@typescript-eslint/parser": "5.57.1",
      "ts-node": "10.9.1",
      "typescript": "4.9.5",
      "ts-loader": "9.4.2",
      "@types/node": "18.15.11"
    }
  }`
const tsconfig =
  // prettier-ignore
  `{
    "compilerOptions": {
        "jsx": "preserve",
        "target": "es5",
        "module": "commonjs",
        "strict": true,
        "esModuleInterop": true,
        "lib": [
            "es2015",
            "es2017",
            "esnext"
        ],
        "experimentalDecorators": true,
        // "typeRoots": [
        //     "node_modules/@types",
        //     "../"
        // ],
    },
    "include": [
        "**/*.ts"
    ],
    "exclude": [
        "dist",
        "src"
    ]
}`
export class DockerfileHelper {
  public async runDocker(
    ruleMeta: EslintRuleGeneratorMeta,
    generatedCode: string,
    options: {
      openAiApiKey: string
      tmpCodeFilePath: string
    }
  ): Promise<string> {
    // these should be baked into the docker image
    this.writefile(options.tmpCodeFilePath, 'Dockerfile', dockerFile)
    this.writefile(options.tmpCodeFilePath, 'package.json', packageJson)
    this.writefile(options.tmpCodeFilePath, 'tsconfig.json', tsconfig)
    this.writefile(options.tmpCodeFilePath, 'test.ts', testScript)
    // these two are unique to each run
    this.writefile(
      options.tmpCodeFilePath,
      'ruleMeta.json',
      JSON.stringify(ruleMeta)
    )
    this.writefile(generatedCode, 'ldt-eslint-tmp-code-file.ts', generatedCode)

    const res = await execAsync(
      `docker run -e OPEN_API_CHAT_GPT_KEY=${
        options.openAiApiKey
      } -v "${path.dirname(
        options.tmpCodeFilePath
      )}:/app" --rm $(docker build -q "${path.dirname(
        options.tmpCodeFilePath
      )}")` // later we can add a docker image name here
    )
    console.log(res.stdout)
    return res.stdout + res.stderr
  }
  public async writefile(
    tmpCodeFilePath: string,
    fileName: string,
    fileContents: string
  ) {
    fs.writeFileSync(
      path.join(path.dirname(tmpCodeFilePath), fileName),
      fileContents
    )
  }
}
