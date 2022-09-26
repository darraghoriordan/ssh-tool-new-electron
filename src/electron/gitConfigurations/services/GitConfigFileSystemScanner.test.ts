import GitConfigFileSystemScanner from './GitConfigFileSystemScanner'

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
})
