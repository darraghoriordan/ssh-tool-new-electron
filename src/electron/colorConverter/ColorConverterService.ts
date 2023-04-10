import {
  ColorConverterMessage,
  ColorConverterResponse,
} from './channels/MessageTypes'
import { colord, extend, Colord } from 'colord'
import hwbPlugin from 'colord/plugins/hwb'
import cmykPlugin from 'colord/plugins/cmyk'
import harmonies from 'colord/plugins/harmonies'
import namesPlugin from 'colord/plugins/names'
import { HarmonyColors } from './HarmonyColors'
import * as nearestColour from 'nearest-color'
import { tailwindColours } from './tailwindColors-v33'

extend([hwbPlugin, cmykPlugin, harmonies, namesPlugin])
const getNearestTailwindColour = nearestColour.from(tailwindColours)

export class ColorConverter {
  static convert(request: ColorConverterMessage): ColorConverterResponse {
    const trimmedInput = request.color.trim()

    const color = colord(trimmedInput)
    if (!color.isValid()) {
      throw new Error(`"${trimmedInput}" is not a valid color`)
    }

    const name = color.toName()

    return {
      name: name ?? 'No exact name found',
      rgb: color.toRgbString(),
      hex: color.toHex(),
      hsl: color.toHslString(),
      hwb: color.toHwbString(),
      cmyk: color.toCmykString(),
      harmonyColors: this.mapHarmonies(color),
      nearestTailwindColor: this.nearestTailwindColor(color),
    }
  }

  static nearestTailwindColor(color: Colord) {
    const nearestTw = getNearestTailwindColour(color.toHex())
    return {
      name: nearestTw.name,
      value: nearestTw.value,
    }
  }

  static mapHarmonies(color: Colord) {
    const harmonies = new HarmonyColors()
    harmonies.analogus = color.harmonies('analogous').map(c => c.toHex())
    harmonies.complementary = color
      .harmonies('complementary')
      .map(c => c.toHex())
    harmonies.doubleSplitComplementary = color
      .harmonies('double-split-complementary')
      .map(c => c.toHex())
    harmonies.rectangle = color.harmonies('rectangle').map(c => c.toHex())
    harmonies.splitComplementary = color
      .harmonies('split-complementary')
      .map(c => c.toHex())
    harmonies.tetradic = color.harmonies('tetradic').map(c => c.toHex())
    harmonies.triadic = color.harmonies('triadic').map(c => c.toHex())

    return harmonies
  }
}
