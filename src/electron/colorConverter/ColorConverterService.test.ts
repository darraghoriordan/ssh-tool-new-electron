import { ColorConverterResponse } from './channels/MessageTypes'
import { ColorConverter } from './ColorConverterService'

describe('UnixTimeConverterService', () => {
  test.each([
    [
      '  #2233FF', // trims whitespace
      {
        cmyk: 'device-cmyk(87% 80% 0% 0%)',
        rgb: 'rgb(34, 51, 255)',
        harmonyColors: {
          analogus: ['#22a3ff', '#2234ff', '#7e22ff'],
          complementary: ['#2234ff', '#ffed22'],
          doubleSplitComplementary: [
            '#22a3ff',
            '#2234ff',
            '#7e22ff',
            '#ff7e22',
            '#a3ff22',
          ],
          rectangle: ['#2234ff', '#ed22ff', '#ffed22', '#34ff22'],
          splitComplementary: ['#2234ff', '#ff7e22', '#a3ff22'],
          tetradic: ['#2234ff', '#ff22a3', '#ffed22', '#22ff7e'],
          triadic: ['#2234ff', '#ff2234', '#34ff22'],
        },
        hex: '#2233ff',
        hsl: 'hsl(235, 100%, 57%)',
        hwb: 'hwb(235 13% 0%)',
        name: 'No exact name found',
        nearestTailwindColor: {
          name: 'blue-700',
          value: '#1d4ed8',
        },
      } as ColorConverterResponse,
    ],
    [
      'rgb(34, 51, 255)', // trims whitespace
      {
        cmyk: 'device-cmyk(87% 80% 0% 0%)',
        rgb: 'rgb(34, 51, 255)',
        harmonyColors: {
          analogus: ['#22a3ff', '#2234ff', '#7e22ff'],
          complementary: ['#2234ff', '#ffed22'],
          doubleSplitComplementary: [
            '#22a3ff',
            '#2234ff',
            '#7e22ff',
            '#ff7e22',
            '#a3ff22',
          ],
          rectangle: ['#2234ff', '#ed22ff', '#ffed22', '#34ff22'],
          splitComplementary: ['#2234ff', '#ff7e22', '#a3ff22'],
          tetradic: ['#2234ff', '#ff22a3', '#ffed22', '#22ff7e'],
          triadic: ['#2234ff', '#ff2234', '#34ff22'],
        },
        hex: '#2233ff',
        hsl: 'hsl(235, 100%, 57%)',
        hwb: 'hwb(235 13% 0%)',
        name: 'No exact name found',
        nearestTailwindColor: {
          name: 'blue-700',
          value: '#1d4ed8',
        },
      } as ColorConverterResponse,
    ],
  ])(
    'is an expected response when converting',
    (colorString: string, expected: ColorConverterResponse) => {
      const result = ColorConverter.convert({ color: colorString })

      expect(result).toEqual(expected)
    }
  )

  it('throws on invalid input ', () => {
    const localeDateString = '24/09/2022, 2:18:40 am'
    expect(() => ColorConverter.convert({ color: localeDateString })).toThrow(
      '"24/09/2022, 2:18:40 am" is not a valid color'
    )
  })
})
