import { plainToClass, plainToInstance } from 'class-transformer'
import { GitConfigInfo } from '../models/GitConfigInfo'
import GitConfigFileSystemScanner from './GitConfigFileSystemScanner'
import data from './GitConfigFileSystemScanner.data.json'

describe('GitConfigFileSystemScanner', () => {
  //prettier-ignore
  const rawWindowsOutput = ` C:\\projects\\obsidian-darragh-main\\.git
        C:\\projects\\qmk_firmware\\.git
         
         `

  test.each([[rawWindowsOutput, 3]])(
    'is an expected response',
    async (stdout: string, length: number) => {
      const result =
        await GitConfigFileSystemScanner.getListOfPathsToGitConfigFiles(
          stdout,
          'c:\\Users\\test\\AppData\\Roaming\\Git\\config'
        )
      expect(result.length).toEqual(length)
    }
  )

  it('can parse the warning messages as expected', () => {
    const ghIniFiles: GitConfigInfo[] = plainToInstance(GitConfigInfo, data)

    // now test the broken method
  })
})
