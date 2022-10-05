import Case from 'case'
import { StringCaseResponse, StringCases } from './channels/MessageTypes'

export class StringCase {
  static changeCase(input: string, toCase: StringCases): StringCaseResponse {
    const trimmedInput = input.trim()
    const detectedNewLine = trimmedInput.includes('\r\n') ? '\r\n' : '\n'

    const theArray = trimmedInput.split(detectedNewLine)

    switch (toCase) {
      case StringCases.camel:
        return {
          result: theArray.map(x => Case.camel(x)).join(detectedNewLine),
        }
      case StringCases.capital:
        return {
          result: theArray.map(x => Case.capital(x)).join(detectedNewLine),
        }
      case StringCases.constant:
        return {
          result: theArray.map(x => Case.constant(x)).join(detectedNewLine),
        }
      case StringCases.header:
        return {
          result: theArray.map(x => Case.header(x)).join(detectedNewLine),
        }
      case StringCases.kebab:
        return {
          result: theArray.map(x => Case.kebab(x)).join(detectedNewLine),
        }
      case StringCases.lower:
        return {
          result: theArray.map(x => Case.lower(x)).join(detectedNewLine),
        }
      case StringCases.pascal:
        return {
          result: theArray.map(x => Case.pascal(x)).join(detectedNewLine),
        }
      case StringCases.sentence:
        return {
          result: theArray.map(x => Case.sentence(x)).join(detectedNewLine),
        }
      case StringCases.snake:
        return {
          result: theArray.map(x => Case.snake(x)).join(detectedNewLine),
        }
      case StringCases.title:
        return {
          result: theArray.map(x => Case.title(x)).join(detectedNewLine),
        }
      case StringCases.upper:
        return {
          result: theArray.map(x => Case.upper(x)).join(detectedNewLine),
        }
      default:
        throw new Error(`Invalid case: ${toCase}`)
    }
  }
}
