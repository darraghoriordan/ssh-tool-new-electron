import { IpcMainEvent } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import { StringCase } from '../StringCaseService'
import { StringCaseChannelPub } from './StringCaseChannelPub'
import {
  StringCaseMessage,
  StringCaseResponse,
  StringCases,
} from './MessageTypes'

export class StringCaseChannelSub
  extends StringCaseChannelPub
  implements IIpcMainInvokeEventSub<StringCaseMessage, StringCaseResponse>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: StringCaseMessage
  ): Promise<StringCaseResponse> {
    // components
    const toCase = StringCases[request.toCase as keyof typeof StringCases]

    return StringCase.changeCase(request.data, toCase)
  }
}
