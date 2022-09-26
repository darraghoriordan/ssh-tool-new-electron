import { spawnPromise } from '../../services/PromisifiedNodeUtilities/SpawnPromise'

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
    const stdout = await spawnPromise(
      'find',
      [
        `${scanStartPath}`,
        '-type',
        'd',
        '(',
        '-path',
        './Library',
        '-o',
        '-path',
        './.Trash',
        '-o',
        '-path',
        './.config',
        '-o',
        '-path',
        './.nuget',
        '-o',
        '-path',
        './.vscode',
        '-o',
        '-path',
        './.npm',
        '-o',
        '-path',
        './development/flutter',
        '-o',
        '-path',
        './Virtual Machines.localized',
        '-o',
        '-path',
        './Applications',
        '-o',
        '-path',
        './Movies',
        '-o',
        '-path',
        './Music',
        '-o',
        '-path',
        './Pictures',
        '-o',
        '-path',
        './Public',
        '-o',
        '-path',
        './.antigen',
        '-o',
        '-name',
        'node_modules',
        ')',
        '-prune',
        '-o',
        '-name',
        '.git',
        '-print',
      ],
      scanStartPath
    )
    return stdout
  }
}
