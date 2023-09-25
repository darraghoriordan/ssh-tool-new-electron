import { CategoryEnum } from '../../../electron/devHistory/services/openai-service'

export const defaultColor = {
  text: 'text-stone-500',
  textDark: 'text-stone-700',
  hoverTextDark: 'group-hover:text-stone-700',
  bg: 'bg-stone-50',
  bgDark: 'hover:bg-stone-100',
}

export const colorMap = new Map<
  CategoryEnum,
  {
    text: string
    textDark: string
    bg: string
    hoverTextDark: string
    bgDark: string
  }
>([
  [
    'marketing',
    {
      text: 'text-sky-500',
      textDark: 'text-sky-700',
      bg: 'bg-sky-50',
      hoverTextDark: 'group-hover:text-sky-700',
      bgDark: 'hover:bg-sky-100',
    },
  ],
  [
    'software-development',
    {
      text: 'text-green-500',
      textDark: 'text-green-700',
      bg: 'bg-green-50',
      hoverTextDark: 'group-hover:text-green-700',
      bgDark: 'hover:bg-green-100',
    },
  ],
  [
    'sales',
    {
      text: 'text-rose-500',
      textDark: 'text-rose-700',
      bg: 'bg-rose-50',
      hoverTextDark: 'group-hover:text-rose-700',
      bgDark: 'hover:bg-rose-100',
    },
  ],
  [
    'personal',
    {
      text: 'text-purple-500',
      textDark: 'text-purple-700',
      bg: 'bg-purple-50',
      hoverTextDark: 'group-hover:text-purple-700',
      bgDark: 'hover:bg-purple-100',
    },
  ],
])
