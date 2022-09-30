import { Expose } from 'class-transformer'
import { IsString, MinLength } from 'class-validator'

export class UserSettings {
  @Expose()
  @IsString()
  @MinLength(1)
  sshConfigFilePath!: string

  @Expose()
  @IsString()
  @MinLength(1)
  projectsPath!: string

  @Expose()
  @IsString()
  @MinLength(1)
  globalGitConfigFile!: string
}
