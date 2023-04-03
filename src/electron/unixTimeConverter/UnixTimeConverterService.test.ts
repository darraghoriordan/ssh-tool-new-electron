import { UnixTimeConverterResponse } from './channels/MessageTypes'
import { UnixTimeConverter } from './UnixTimeConverterService'

describe('UnixTimeConverterService', () => {
  test.each([
    [
      '   2022-09-24T00:56:31+10:00    ', // trims whitespace
      new Date('2020-09-24T02:18:40+10:00'), // "now" in the past so future difference
      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        unixTimestamp: 1663944991,
        differenceFromNow: 'in almost 2 years',
      } as UnixTimeConverterResponse,
    ],
    [
      '2022-09-24T00:56:31+10:00', // an iso timestamp input with timezone
      new Date('2020-09-24T02:18:40+10:00'), // "now" in the past so future difference
      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        unixTimestamp: 1663944991,
        differenceFromNow: 'in almost 2 years',
      } as UnixTimeConverterResponse,
    ],
    [
      '2022-09-23T14:56:31.000Z', // an iso timestamp input
      new Date('2020-09-24T02:18:40+10:00'), // "now" in the past so future difference
      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        unixTimestamp: 1663944991,
        differenceFromNow: 'in almost 2 years',
      } as UnixTimeConverterResponse,
    ],
    [
      '1663944991',
      new Date('2020-09-24T02:18:40+10:00'), // "now" in the past so future difference

      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        unixTimestamp: 1663944991,
        differenceFromNow: 'in almost 2 years',
      } as UnixTimeConverterResponse,
    ],
    [
      '1663944991',
      new Date('2122-09-24T02:18:40+10:00'), // "now" in the future from the provided date

      {
        utcDate: '2022-09-23T14:56:31.000Z',
        localeDate: '24/09/2022, 12:56:31 am',
        isoDate: '2022-09-24T00:56:31+10:00',
        unixTimestamp: 1663944991,
        differenceFromNow: 'about 100 years ago', // so difference is in the past
      } as UnixTimeConverterResponse,
    ],
    [
      '1663949920',
      new Date('2022-09-24T02:18:40+10:00'), // "now" very close to date
      {
        utcDate: '2022-09-23T16:18:40.000Z',
        localeDate: '24/09/2022, 2:18:40 am',
        isoDate: '2022-09-24T02:18:40+10:00',
        unixTimestamp: 1663949920,
        differenceFromNow: 'less than 5 seconds ago',
      } as UnixTimeConverterResponse,
    ],
  ])(
    'is an expected response when converting',
    (
      timestampString: string,
      nowDate: Date,
      expected: UnixTimeConverterResponse
    ) => {
      const result = UnixTimeConverter.convert(timestampString, nowDate)

      expect(result).toEqual(expected)
    }
  )

  it('throws on invalid input ', () => {
    const localeDateString = '24/09/2022, 2:18:40 am'
    const nowDate = new Date('2022-09-24T02:18:40+10:00')

    expect(() => UnixTimeConverter.convert(localeDateString, nowDate)).toThrow(
      'Invalid input. Input must be an ISO date or unix timestamp'
    )
  })
})
