/* eslint-disable no-useless-escape */
import { exec } from 'child_process'
import { promisify } from 'util'
const execPromise = promisify(exec)
/**
 * Used when the cache is empty or missing
 * Will rescan the file system for git config files and
 * process them into our required model
 */
export default class FileListResolverNix {
  public platformMatchers = ['linux', 'darwin']

  /**
   * output looks like
   * /Users/darraghoriordan/Documents/personal-projects/ssh-tool-new-electron/.git
   * /Users/darraghoriordan/Documents/personal-projects/mac-setup-script/.git
   * /Users/darraghoriordan/Documents/personal-projects/remix-project/.git
   * @param stdout
   * @param scanStartPath
   * @returns
   */

  // for this to be useful to more people, they might need to be able to configure this
  public ignoreNames = [
    './Library',
    './.Trash',
    './.config',
    './.nuget',
    './.vscode',
    './.npm',
    './Music',
    './Pictures',
    '.docker-compose',
    'node_modules',
  ]
  public async scanFileSystem(scanStartPath: string): Promise<string> {
    try {
      const cmdArguments = [
        `${scanStartPath}`,
        // prettier-ignore
        "-type d \\( "
        +
        `${this.ignoreNames.map(name => `-name '${name}'`).join(' -o ')}`
         +
         " \\) -prune -o -type d -name '.git' -print",
      ]
      const command = `find ${cmdArguments.join(' ')}`
      console.log(`Running command: find ${cmdArguments.join(' ')}`)
      const output = await execPromise(command, {
        cwd: scanStartPath,
      })
      return output.stdout
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
