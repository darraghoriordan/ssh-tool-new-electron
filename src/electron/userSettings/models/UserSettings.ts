import { Expose } from 'class-transformer'
import { IsOptional, IsString, MinLength } from 'class-validator'

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

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  openApiChatGptKey?: string

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  openApiOrgId?: string
}
