export type GenerateCertMessage = {
  certName: string
  emailAddress: string
  passphrase: string
}
export type GenerateCertResponse = {
  certName: string
  errorMessage: string | undefined
  isInError: boolean
}

export type SshCertFileInfo = {
  privateKeyPath: string
  publicKeyPath: string
  fingerprint: string
  name: string
  foundInAgentList: boolean
}

export type ScanForSshCertsResponse = {
  privateKeys: SshCertFileInfo[]
  path: string
  isInError: boolean
  errorMessage?: string
}
