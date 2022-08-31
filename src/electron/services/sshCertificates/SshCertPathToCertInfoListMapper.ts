import { SshCertFileInfo } from './Types'

export class SshCertPathToCertInfoListMapper {
  public static map(
    sshFilePath: string,
    stdout: string,
    stderr: string
  ): SshCertFileInfo[] {
    console.debug('parsing.. ', {
      sshFilePath,
      stderr,
      stdout,
    })
    const response: SshCertFileInfo[] = []

    if (stderr) {
      return response
    }

    const paths = stdout
      .split(/\r?\n/)
      .filter((x: string | undefined) => x && x.trim() !== '')
      .map((file: string) => {
        return {
          privateKeyPath: file,
          fingerprint: '',
          foundInAgentList: false,
          publicKeyPath: `${file}.pub`,
          name: file.replace(`${sshFilePath}/`, ''),
        } as SshCertFileInfo
      })

    console.log('returning response', response)
    return paths
  }
}
