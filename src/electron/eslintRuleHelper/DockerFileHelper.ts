import fs from 'fs'
import fsp from 'fs/promises'
import path from 'path'
import exec from 'child_process'
import { promisify } from 'util'
import EslintRuleGeneratorMeta from './models/EslintRuleGeneratorMeta'
const execAsync = promisify(exec.exec)

// prettier-ignore
const dockerignore = `Dockerfile*
.dockerignore
node_modules
npm-debug.log
README.md
.next
.git
.jest_cache
.docker-compose
.vscode
.terraform
.husky
`

export class DockerfileHelper {
  public async runDocker(
    ruleMeta: EslintRuleGeneratorMeta,
    generatedCode: string,
    options: {
      openAiApiKey: string
      tmpCodeFilePath: string
    }
  ): Promise<{ stdout: string; stderr: string }> {
    const dirPath = options.tmpCodeFilePath
    // clean up all files in the directory
    for (const file of await fsp.readdir(dirPath)) {
      await fsp.unlink(path.join(dirPath, file))
    }
    // these are unique to each run
    this.writefile(dirPath, '.dockerignore', dockerignore)
    this.writefile(dirPath, 'ruleMeta.json', JSON.stringify(ruleMeta))
    this.writefile(dirPath, 'ldt-eslint-tmp-code-file.ts', generatedCode)
    const imageName = 'darraghoriordan/ldt-eslint:latest'
    const res = await execAsync(
      `docker pull ${imageName} && docker run -e OPEN_API_CHAT_GPT_KEY=${options.openAiApiKey} -v "${options.tmpCodeFilePath}:/app/usr" ${imageName}`,
      {
        env: {
          path: process.env.PATH + ':/usr/local/bin',
        },
      }
    )
    return res
  }
  public async writefile(
    tmpCodeFilePath: string,
    fileName: string,
    fileContents: string
  ) {
    fs.writeFileSync(path.join(tmpCodeFilePath, fileName), fileContents)
  }
}
