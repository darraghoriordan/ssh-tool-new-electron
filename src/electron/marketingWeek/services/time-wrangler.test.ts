import { calculateIncrements, getStartAndEndOfDay } from './time-wrangler'

describe('time-wrangler', () => {
  it('should calculate increments for a whole day', () => {
    const increments = calculateIncrements({
      startDate: new Date('2023-09-22T14:00:00.000Z'),
      endDate: new Date('2023-09-23T13:59:59.999Z'),
    })
    expect(increments.length).toEqual(48)
  })

  it('should calculate increments for a partial day', () => {
    const increments = calculateIncrements({
      startDate: new Date('2021-09-23T00:00:00.000Z'),
      endDate: new Date('2021-09-23T04:22:59.999Z'),
    })
    expect(increments.length).toEqual(9)
  })

  it('should calculate locale day start and end', () => {
    const { startDate, endDate } = getStartAndEndOfDay(
      {
        day: 23,
        monthIndex: 8,
        year: 2023,
      },
      new Date(),
    )
    expect(startDate.toISOString()).toEqual('2023-09-22T14:00:00.000Z')
    expect(endDate.toISOString()).toEqual('2023-09-23T13:59:59.999Z')
  })

  it('should calculate locale day start and end for now', () => {
    const { startDate, endDate } = getStartAndEndOfDay(
      {
        day: 23,
        monthIndex: 8,
        year: 2023,
      },
      new Date(2023, 8, 23, 6, 35, 0, 0),
    )
    expect(startDate.toISOString()).toEqual('2023-09-22T14:00:00.000Z')
    expect(endDate.toISOString()).toEqual('2023-09-22T20:35:00.000Z')
  })
})
