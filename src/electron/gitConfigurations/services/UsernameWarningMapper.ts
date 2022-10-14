import { GitConfigInfo } from '../models/GitConfigInfo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onlyUnique(value: any, index: any, self: any) {
  return self.indexOf(value) === index
}

export class UsernameWarningMapper {
  // there's probably a way to do this with a single reduce
  // but i had some typos and it wasn't working so I pulled lots of stuff apart to make sense of it :D
  static mapWarningMessagesForCommitNames = (
    parsedIniFiles: GitConfigInfo[]
  ): string[] => {
    const warnings: string[] = []
    // a list of origin sources (e.g. "github.com" for http or "pgh" for ssh)
    const uniqueSources =
      UsernameWarningMapper.extractUniqueSources(parsedIniFiles)

    for (const originSource of uniqueSources) {
      // find all the inis with this origin source
      const configsForSources = parsedIniFiles.filter(config =>
        config.remotes.some(x => x.source === originSource)
      )
      // grab all the unique emails used for this collection of inifiles of a single origin source
      const uniqueEmails =
        UsernameWarningMapper.extractUniqueEmailsUsedForSource(
          configsForSources
        )

      if (uniqueEmails.length <= 1) {
        // this origin source only has one email in use
        // so it "passes" the test
        continue
      }

      // otherwise there are multiple emails in use for this origin source so...
      const emailsConfigsMap = UsernameWarningMapper.createMapOfEmailUsage(
        uniqueEmails,
        configsForSources
      )
      // out of all of those find the least used one
      const leastUsedEmail: string = UsernameWarningMapper.findLeastUsedEmail(
        uniqueEmails,
        emailsConfigsMap
      )

      // and return all of those
      const warning = `There is a mismatch between the git user set for [${emailsConfigsMap
        .get(leastUsedEmail)
        ?.map(x => x.originRepositoryFileName)
        .join(
          ', '
        )}] and the user set for other repositories with the same origin.`

      warnings.push(warning)
    }

    return warnings
  }

  public static findLeastUsedEmail(
    uniqueEmails: string[],
    emailsConfigsMap: Map<string, GitConfigInfo[]>
  ): string {
    return uniqueEmails.reduce((prev, current) => {
      const prevCount = emailsConfigsMap.get(prev)?.length ?? 0
      const currentCount = emailsConfigsMap.get(current)?.length ?? 0

      if (prevCount < currentCount) {
        return prev
      }

      return current
    }, uniqueEmails[0])
  }

  public static createMapOfEmailUsage(
    uniqueEmails: string[],
    configsForSources: GitConfigInfo[]
  ) {
    const emailsConfigsMap = new Map<string, GitConfigInfo[]>()
    uniqueEmails.filter(m => m !== undefined) as string[] // in case there are undefineds in there

    // map the emails to the configs that use them
    uniqueEmails.forEach(email => {
      const configsForEmail = configsForSources.filter(
        config => config.user?.email === email
      )

      if (emailsConfigsMap.has(email)) {
        emailsConfigsMap.get(email)?.push(...configsForEmail)
      } else {
        emailsConfigsMap.set(email, configsForEmail)
      }
    })
    return emailsConfigsMap
  }

  public static extractUniqueEmailsUsedForSource(configs: GitConfigInfo[]) {
    return configs
      .map(config => config.user?.email)
      .filter(x => x !== undefined)
      .filter(onlyUnique) as string[]
  }

  public static extractUniqueSources(
    parsedIniFiles: GitConfigInfo[]
  ): string[] {
    return parsedIniFiles
      .map(config => {
        const originSource = config.remotes.find(x =>
          x.remoteName.includes('origin')
        )?.source

        return originSource
      })
      .filter(x => x !== undefined)
      .filter(onlyUnique) as string[]
  }
}
