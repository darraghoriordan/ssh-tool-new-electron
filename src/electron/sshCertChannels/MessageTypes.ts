export type GenerateCertMessage = {
  certName: string
  emailAddress: string
  passphrase: string
}

export type ScanForSshCertsMessage = {
  forceFileSystemSearch: boolean
}

export type GenerateCertResponse = {
  certName: string
  errorMessage: string | undefined
  isInError: boolean
}

export type AddCertMessage = {
  privateCertPath: string
}
export type AddCertResponse = {
  errorMessage: string | undefined
  isInError: boolean
}

export type RemoveCertMessage = {
  privateCertPath: string
}
export type RemoveCertResponse = {
  errorMessage: string | undefined
  isInError: boolean
}
