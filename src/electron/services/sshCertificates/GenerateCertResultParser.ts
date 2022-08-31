import { GenerateCertResponse } from './Types'

export class GenerateCertResultParser {
  public static parse(
    certName: string,
    stderr: string,
    stdout: string
  ): GenerateCertResponse {
    const response: GenerateCertResponse = {
      certName: certName,
      isInError: false,
      errorMessage: undefined,
    }

    if (stderr) {
      response.errorMessage = stderr
      response.isInError = true
      return response
    }

    console.log('returning response', response)
    return response
  }
}
