import util from 'util'
import { exec } from 'child_process'
import { GenerateCertMessage, GenerateCertResponse } from './Types'
import path from 'path'
import { GenerateCertResultParser } from './GenerateCertResultParser'
import { spawnPromise } from '../PromisifiedNodeUtilities/SpawnPromise'
import { SshCertPathToCertInfoListMapper } from './SshCertPathToCertInfoListMapper'
import { SshCertInfoEnricher } from './SshCertInfoEnricher'

export class SshCertificateManager {
  static async addCertificateToAgent(
    privateCertPath: string
  ): Promise<{ stdout: string; stderr: string }> {
    // run add command
    const procExec = util.promisify(exec)
    return procExec(
      // eslint-disable-next-line no-useless-escape
      `osascript -e 'tell application "Terminal" to activate' -e 'tell application "Terminal" to do script "ssh-add --apple-use-keychain ${privateCertPath}"'`
    )
    //    const result = await procExec(` ssh-add`, ['--apple-use-keychain', request.privateCertPath], {
    //       cwd: sshFilePath,
    //       shell: true,
    //     })
  }

  static async removeCertificateFromAgent(
    privateCertPath: string,
    homeDirectory: string
  ): Promise<string> {
    const sshFilePath = path.join(homeDirectory, '.ssh')
    // run add command
    return spawnPromise(`ssh-add`, ['-d', privateCertPath], sshFilePath, true)
  }

  static async scanForCertificates(homeDirectory: string) {
    // TODO: get the ssh file path from settings
    const sshFilePath = path.join(homeDirectory, '.ssh')

    // scan hdd path for files that look like private keys
    const execSshFileScan = util.promisify(exec)
    const { stdout, stderr } = await execSshFileScan(
      `grep -lrnw '${sshFilePath}' -e 'BEGIN OPENSSH PRIVATE KEY'`
    )
    // parse to list of files (too lazy to create new model. this returns
    // a model with some empty properties that will be enhanced later)
    const sshFiles = SshCertPathToCertInfoListMapper.map(
      sshFilePath,
      stdout,
      stderr
    )

    // create promises for each file to get fingerprints
    const fingerprintPromises = sshFiles.map(fInfo => {
      const execSshFingerprintInfo = util.promisify(
        require('child_process').exec
      ) as (command: string) => Promise<{ stdout: string; stderr: string }>
      return execSshFingerprintInfo(`ssh-keygen -lf '${fInfo.privateKeyPath}'`)
    })
    // create promise to get all keys that are in the ssh agent
    const execSshAddLs = util.promisify(require('child_process').exec) as (
      command: string
    ) => Promise<{ stdout: string; stderr: string }>
    const sshListPromise = execSshAddLs(`ssh-add -l`)

    // run all promises 🚀
    const results = await Promise.allSettled(
      [sshListPromise].concat(fingerprintPromises)
    )

    return SshCertInfoEnricher.enrichModels(sshFilePath, sshFiles, results)
  }

  static async generateCertificate(
    request: GenerateCertMessage,
    homeDirectory: string
  ): Promise<GenerateCertResponse> {
    // TODO: get the ssh file path from settings
    const sshPath = path.join(homeDirectory, '.ssh')

    // scan hdd path for files that look like private keys
    const procExec = util.promisify(exec)
    const { stdout, stderr } = await procExec(
      `ssh-keygen -t rsa -b 4096 -C "${request.emailAddress}" -f ${request.certName} -P "${request.passphrase}"`,
      { cwd: sshPath }
    )

    return GenerateCertResultParser.parse(sshPath, stderr, stdout)
  }
}
