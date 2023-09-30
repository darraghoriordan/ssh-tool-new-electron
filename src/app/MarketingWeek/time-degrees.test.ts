import { calculateTimeDegree } from './Calendar'

describe('time-degrees', () => {
  const date = new Date()
  it('should return 0 degrees for 12:00', () => {
    date.setHours(0)
    date.setMinutes(0)
    expect(calculateTimeDegree(date)).toBe(0)
  })
  it('should return 12 degrees for 1:00', () => {
    date.setHours(1)
    date.setMinutes(0)
    expect(calculateTimeDegree(date)).toBe(12)
  })
  it('should return 18 degrees for 1:30', () => {
    date.setHours(1)
    date.setMinutes(30)
    expect(calculateTimeDegree(date)).toBe(18)
  })
  it('should return 18 degrees for 1:38', () => {
    date.setHours(1)
    date.setMinutes(38)
    expect(calculateTimeDegree(date)).toBe(20)
  })
})
