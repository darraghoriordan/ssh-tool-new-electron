import { StringSorterResponse } from './channels/MessageTypes'
import os from 'os'

export class StringSorter {
  static sortByNewLine(
    input: string,
    asc: boolean,
    locale?: string
  ): StringSorterResponse {
    const trimmedInput = input.trim()
    const detectedNewLine = trimmedInput.includes('\r\n') ? '\r\n' : '\n'

    const theArray = trimmedInput.split(detectedNewLine)
    if (theArray.length <= 1) {
      return { result: trimmedInput }
    }

    const collator = new Intl.Collator(locale, {
      numeric: true,
      sensitivity: 'base',
      usage: 'sort',
    })

    let sortedArray = theArray.sort(collator.compare)
    if (!asc) {
      sortedArray = sortedArray.reverse()
    }

    const resultSorted = sortedArray.join(detectedNewLine)
    return {
      result: resultSorted,
    }
  }
}
