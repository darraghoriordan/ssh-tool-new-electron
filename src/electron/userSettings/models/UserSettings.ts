import { Expose } from 'class-transformer'
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator'

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
  openAiChatGptKey?: string

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  openAiOrgId?: string

  @Expose()
  @IsOptional()
  @IsString()
  @MinLength(1)
  chromeHistoryPath?: string

  @Expose()
  @IsOptional()
  @IsBoolean()
  hasEnabledMarketingWeek?: boolean
}
