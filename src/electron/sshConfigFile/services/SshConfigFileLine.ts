export class SshConfigFileLine {
  constructor(rawLine: string, lineNumber: number) {
    this.rawString = rawLine
    this.lineNumber = lineNumber
    this.isCommented = false
    this.isEmptyLine = false
    this.isParsedSuccessfully = false
  }

  public isCommented!: boolean
  public lineNumber!: number
  public rawString!: string
  public isParsedSuccessfully!: boolean
  public isEmptyLine!: boolean
  public commandKey!: string
  public commandValue!: string
}
