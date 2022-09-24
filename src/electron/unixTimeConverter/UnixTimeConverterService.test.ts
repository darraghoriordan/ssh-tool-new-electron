import { UnixTimeConverterResponse } from './channels/MessageTypes'
import { UnixTimeConverter } from './UnixTimeConverterService'

describe('UnixTimeConverterService', () => {
  test.each([
    [
      '1663944991',
      new Date('2020-09-24T02:18:40+10:00'), // in the past so future difference

      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        differenceFromNow: 'in almost 2 years',
      } as UnixTimeConverterResponse,
    ],
    [
      '1663944991',
      new Date('2122-09-24T02:18:40+10:00'), // in the future from the provided date

      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        differenceFromNow: 'about 100 years ago', // so difference is in the past
      } as UnixTimeConverterResponse,
    ],
    [
      '1663949920',
      new Date('2022-09-24T02:18:40+10:00'), // very close to date
      {
        utcDate: '2022-09-23T16:18:40.000Z',
        localeDate: '24/09/2022, 2:18:40 am',
        isoDate: '2022-09-24T02:18:40+10:00',
        differenceFromNow: 'less than 5 seconds ago',
      } as UnixTimeConverterResponse,
    ],
  ])(
    'is an expected response when converting',
    (
      unixTimestamp: string,
      nowDate: Date,
      expected: UnixTimeConverterResponse
    ) => {
      const result = UnixTimeConverter.convert(unixTimestamp, nowDate)

      expect(result).toEqual(expected)
    }
  )
})
