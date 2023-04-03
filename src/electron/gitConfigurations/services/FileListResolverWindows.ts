import { exec } from 'child_process'
import { promisify } from 'util'
const execPromise = promisify(exec)

/**
 * Used when the cache is empty or missing
 * Will rescan the file system for git config files and
 * process them into our required model
 */
export default class FileListResolverWindows {
  public platformMatchers = ['win32']
  /**
   * output looks like
   * /Users/darraghoriordan/Documents/personal-projects/ssh-tool-new-electron/.git
   * /Users/darraghoriordan/Documents/personal-projects/mac-setup-script/.git
   * /Users/darraghoriordan/Documents/personal-projects/remix-project/.git
   * @param stdout
   * @param scanStartPath
   * @returns
   */
  public async scanFileSystem(scanStartPath: string): Promise<string> {
    const output = await execPromise(`dir /s /b /a:d /s .git`, {
      cwd: scanStartPath,
    })
    return output.stdout
  }
}
