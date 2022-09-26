import { spawnPromise } from '../../services/PromisifiedNodeUtilities/SpawnPromise'

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
    const stdout = await spawnPromise(
      'dir',
      ['/s', '/b', '/a:d', '/s', `.git`],
      scanStartPath
    )
    return stdout
  }
}
