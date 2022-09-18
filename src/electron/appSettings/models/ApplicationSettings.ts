import { Expose } from 'class-transformer'
import { IsString, MinLength } from 'class-validator'

export class ApplicationSettings {
  @Expose()
  @IsString()
  @MinLength(1)
  sshCertPath!: string

  @Expose()
  @IsString()
  @MinLength(1)
  projectsPath!: string

  @Expose()
  @IsString()
  @MinLength(1)
  globalGitConfigFile!: string
}
