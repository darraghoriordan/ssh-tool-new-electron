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
  public async scanFileSystem(scanStartPath: string): Promise<string> {
    try {
      const cmdArguments = [
        `${scanStartPath}`,
        // prettier-ignore
        "-type d \\( -name './Music' -o -name './Movies' -o -name './Pictures' -o -name './Trash' -o -name './Library' -o -name 'node_modules' \\) -prune -o -type d -name '.git' -print",
      ]
      const command = `find ${cmdArguments.join(' ')}`
      console.log(`Running command: find ${cmdArguments.join(' ')}`)
      const output = await execPromise(
        command,
        //   [
        //     `${scanStartPath}`,
        //     '-type',
        //     'd',
        //     '\(',
        //     '-path',
        //     './Library',
        //     '-o',
        //     '-path',
        //     './.Trash',
        //     '-o',
        //     '-path',
        //     './.config',
        //     '-o',
        //     '-path',
        //     './.nuget',
        //     '-o',
        //     '-path',
        //     './.vscode',
        //     '-o',
        //     '-path',
        //     './.npm',
        //     '-o',
        //     '-path',
        //     './development/flutter',
        //     '-o',
        //     '-path',
        //     './Virtual Machines.localized',
        //     '-o',
        //     '-path',
        //     './Applications',
        //     '-o',
        //     '-path',
        //     './Movies',
        //     '-o',
        //     '-path',
        //     './Music',
        //     '-o',
        //     '-path',
        //     './Pictures',
        //     '-o',
        //     '-path',
        //     './Public',
        //     '-o',
        //     '-path',
        //     './.antigen',
        //     '-o',
        //     '-name',
        //     'node_modules',
        //     '\)',
        //     '-prune',
        //     '-o',
        //     '-name',
        //     '.git',
        //     '-print',
        //   ],
        {
          cwd: scanStartPath,
        }
      )
      return output.stdout
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
