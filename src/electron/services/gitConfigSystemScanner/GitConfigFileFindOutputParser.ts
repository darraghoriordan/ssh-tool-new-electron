import path from 'path'

export class GitConfigFileFindOutputParser {
  public static parse(homePath: string, stdout: string): string[] {
    console.debug('parsing.. ', {
      stdout,
    })
    const response: string[] = []

    const paths = stdout
      .split(/\r?\n/)
      .filter((x: string | undefined) => x && x.trim() !== '')
      .map((dotGitPath: string) =>
        path.join(path.resolve(homePath, dotGitPath), 'config')
      )

    console.log('returning response', response)
    return paths
  }
}
