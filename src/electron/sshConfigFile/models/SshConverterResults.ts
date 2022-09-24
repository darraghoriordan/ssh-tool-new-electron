/* eslint-disable @typescript-eslint/no-unused-vars */
export class SshConverterResults {
  constructor(
    public httpUrl: string,
    public sshUrl: string,
    public sshAliases: { alias: string; url: string }[]
  ) {}
}
