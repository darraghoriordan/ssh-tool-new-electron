import { UnixTimeConverterResponse } from './channels/MessageTypes'
import { UnixTimeConverter } from './UnixTimeConverterService'

describe('UnixTimeConverterService', () => {
  test.each([
    [
      '1663944991',
      new Date('2020-09-24T02:18:40+10:00'), // in the past from that date

      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        differenceFromNow: 'almost 2 years ago',
      } as UnixTimeConverterResponse,
    ],
    [
      '1663944991',
      new Date('2322-09-24T02:18:40+10:00'), // in the future from the date

      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        differenceFromNow: 'in about 278 years',
      } as UnixTimeConverterResponse,
    ],
    [
      '1663949920',
      new Date('2022-09-24T02:18:40+10:00'), // very close to date
      {
        utcDate: '2022-09-23T14:56:38.000Z',
        localeDate: '24/09/2022, 12:56:38 am',
        isoDate: '2022-09-24T00:56:38+10:00',
        differenceFromNow: 'about 1 hour ago',
      } as UnixTimeConverterResponse,
    ],
  ])(
    'is an expected response when converting',
    (input: string, nowDate: Date, expected: UnixTimeConverterResponse) => {
      const result = UnixTimeConverter.convert(input, nowDate)

      expect(result).toEqual(expected)
    }
  )
})
