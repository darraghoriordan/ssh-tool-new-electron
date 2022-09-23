/* eslint-disable @typescript-eslint/no-explicit-any */
export type DecodeJwtMessage = {
  jwt: string
}

export type DecodeJwtResponse = {
  algorithm: any
  payload: any
  signature: string
}
