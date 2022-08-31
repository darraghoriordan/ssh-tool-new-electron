import { SshConfigFileLine } from './SshConfigFileLine'
export class AvailableHost {
  alias!: string
  user!: string
  destination!: string
}
export class SshConfigFileParser {
  public static parse(rawFile: string): SshConfigFileLine[] {
    const parsedLines = rawFile
      .split(/\r?\n/)
      .map((line: string, index: number) => {
        return this.parseSingleLine(line, index)
      })

    return parsedLines
  }

  public static parseValidSshHosts(rawFile: string): AvailableHost[] {
    const parsedLines = rawFile
      .split(/\r?\n/)
      .map((line: string, index: number) => {
        return this.parseSingleLine(line, index)
      })
    console.log('Parsed ssh config file lines: ', parsedLines.length)
    return this.parseSshHosts(parsedLines)
  }

  public static parseSshHosts(lines: SshConfigFileLine[]): AvailableHost[] {
    // end state is 1 or more valid git ssh profiles
    // start states are no, or empty ssh config
    // existing config but no git config
    // existing git configs

    // first try to find existing configs
    const availableHosts = []
    let currentAvailableHost: AvailableHost | undefined
    for (const line of lines) {
      if (line.commandKey === 'Host') {
        // check if we have completely parsed a previous host
        if (currentAvailableHost) {
          availableHosts.push({ ...currentAvailableHost })
          currentAvailableHost = undefined
        }
        currentAvailableHost = new AvailableHost()
        currentAvailableHost.alias = line.commandValue
        continue
      }
      if (!currentAvailableHost) {
        // we haven't hit a host line yet
        continue
      }
      if (line.commandKey === 'User') {
        currentAvailableHost.user = line.commandValue
        continue
      }
      if (line.commandKey === 'HostName') {
        currentAvailableHost.destination = line.commandValue
        continue
      }
    }
    return availableHosts
  }

  public static parseSingleLine(
    rawLine: string,
    lineNumber: number
  ): SshConfigFileLine {
    const parsedLine = new SshConfigFileLine(rawLine, lineNumber)

    // remove all the whitespace
    const trimmedLine = parsedLine.rawString.trim()

    // is it an empty line?
    if (trimmedLine === '') {
      parsedLine.isEmptyLine = true
      return parsedLine
    }

    // is it a comment?
    if (trimmedLine.startsWith('#')) {
      parsedLine.isCommented = true
      return parsedLine
    }
    // can we split it to get key and value?
    const lineKey = trimmedLine.substring(0, trimmedLine.indexOf(' '))
    const lineValue = trimmedLine.substring(trimmedLine.indexOf(' ') + 1)

    // validate the parsing
    if (
      !lineKey ||
      lineKey.length === 0 ||
      !lineValue ||
      lineValue.length === 0
    ) {
      parsedLine.isParsedSuccessfully = false
      return parsedLine
    }

    parsedLine.isParsedSuccessfully = true
    parsedLine.commandKey = lineKey
    parsedLine.commandValue = lineValue

    return parsedLine
  }
}
