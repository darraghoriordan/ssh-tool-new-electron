import { ScanForSshCertsResponse, SshCertFileInfo } from './Types'
import util from 'util'

export class SshCertInfoEnricher {
  public static enrichModels(
    sshFilePath: string,
    sshFiles: SshCertFileInfo[],
    results: PromiseSettledResult<{
      stdout: string
      stderr: string
    }>[]
  ): ScanForSshCertsResponse {
    console.debug('parsing.. ', {
      sshFilePath,
      sshFiles,
      results: util.inspect(results, undefined, 4),
    })
    const response: ScanForSshCertsResponse = {
      path: sshFilePath,
      privateKeys: [],
      isInError: false,
      errorMessage: undefined,
    }
    const certsInSshAgentResult = results[0]
    if (
      certsInSshAgentResult.status === 'rejected' ||
      certsInSshAgentResult.value.stderr
    ) {
      response.errorMessage = "Couldn't list certs in ssh-agent. Is it running?"
      response.isInError = true
      return response
    }
    const enhancedFiles = sshFiles.map((file, index) => {
      const fingerprintResult = results[index + 1]
      if (
        fingerprintResult.status === 'fulfilled' &&
        !fingerprintResult.value.stderr
      ) {
        const outputSplit = fingerprintResult.value.stdout.split(' ')
        file.fingerprint = outputSplit?.[1] || ''
        file.foundInAgentList = certsInSshAgentResult.value.stdout.includes(
          file.fingerprint
        )
      }
      return file
    })
    response.privateKeys = enhancedFiles
    console.log('response', response)
    return response
  }
}
