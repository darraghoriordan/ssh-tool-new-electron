export class SshHostModel {
  public nickname!: string
  public hostName!: string
  public user!: string
  public identityFile!: string
  public addKeysToAgent!: boolean
  public preferredAuthentications!: string
  public useKeychain!: boolean
  public identitiesOnly!: boolean
}
