/* eslint-disable @typescript-eslint/no-explicit-any */
export type StringCaseMessage = {
  data: string
  toCase: string
}

export type StringCaseResponse = {
  result: string
}

export enum StringCases {
  upper = 'upper',
  lower = 'lower',
  capital = 'capital',
  snake = 'snake',
  pascal = 'pascal',
  camel = 'camel',
  kebab = 'kebab',
  header = 'header',
  constant = 'constant',
  title = 'title',
  sentence = 'sentence',
}
