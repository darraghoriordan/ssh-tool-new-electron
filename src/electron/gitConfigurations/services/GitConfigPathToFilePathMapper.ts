import path from 'path'

export class GitConfigPathToFilePathMapper {
  public static map(homePath: string, stdout: string): string[] {
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
