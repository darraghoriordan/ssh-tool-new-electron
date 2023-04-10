import { HarmonyColors } from '../HarmonyColors'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ColorConverterMessage = {
  color: string
}

export type ColorConverterResponse = {
  name: string
  rgb: string
  hex: string
  hsl: string
  hwb: string
  cmyk: string
  harmonyColors: HarmonyColors
  nearestTailwindColor: {
    name: string
    value: string
  }
}
