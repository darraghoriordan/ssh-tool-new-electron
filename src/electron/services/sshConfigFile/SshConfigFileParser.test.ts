import { SshConfigFileParser } from './SshConfigFileParser'
import { SshConfigFileLine } from './SshConfigFileLine'

const input = `Host dokku-as-darragh
HostName 165.232.148.97
User dokku
    IdentityFile ~/.ssh/digioceanMacbook
    AddKeysToAgent yes
    PreferredAuthentications publickey
    UseKeychain yes
    IdentitiesOnly yes

#Host *
# AddKeysToAgent yes
# UseKeychain yes
# IdentityFile ~/.ssh/id_rsa`

describe('SshConfigFileParser', () => {
  it('parses the correct number of lines', () => {
    const result = SshConfigFileParser.parse(input)
    const expected = 13

    expect(result.length).toBe(expected)
  })

  it('can parse host line', () => {
    const expected = new SshConfigFileLine('Host dokku-as-darragh', 0)
    expected.commandKey = 'Host'
    expected.commandValue = 'dokku-as-darragh'
    expected.isParsedSuccessfully = true

    const result = SshConfigFileParser.parse(input)

    expect(result[0]).toMatchObject(expected)
  })

  it('can parse empty line', () => {
    const expected = new SshConfigFileLine('', 8)
    expected.isEmptyLine = true

    const result = SshConfigFileParser.parse(input)

    expect(result[8]).toMatchObject(expected)
  })

  it('can parse commented line', () => {
    const expected = new SshConfigFileLine('# AddKeysToAgent yes', 10)
    expected.isCommented = true

    const result = SshConfigFileParser.parse(input)

    expect(result[10]).toMatchObject(expected)
  })
})
