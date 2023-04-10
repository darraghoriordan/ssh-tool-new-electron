import { IpcMainEvent, app } from 'electron'
import { IIpcMainInvokeEventSub } from '../../IpcChannelTypes/IIpcMainInvokeEventSub'
import path from 'path'
import fs from 'fs'
import { ListPastGenerationsChannelPub } from './ListPastGenerationsChannelPub'

export class PastGenerationFile {
  path!: string
  displayName!: string
}
export class ListPastGenerationsChannelSub
  extends ListPastGenerationsChannelPub
  implements IIpcMainInvokeEventSub<undefined, PastGenerationFile[]>
{
  async handle(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: IpcMainEvent
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ): Promise<PastGenerationFile[]> {
    // create the directory if it doesn't exist
    const genPath = path.join(app.getPath('userData'), 'eslint-generations')
    if (!fs.existsSync(genPath)) {
      console.log('creating dir', genPath)
      fs.mkdirSync(genPath, {
        recursive: true,
      })
    }
    const allDirEntries = await fs.readdirSync(genPath, {
      withFileTypes: true,
    })
    // return only files listed by name descending
    const onlyFilesDesc = allDirEntries
      .filter(entry => entry.name.endsWith('.json'))
      .sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
      .reverse()
      .map(entry => {
        const pastGenerationFile = new PastGenerationFile()
        pastGenerationFile.path = path.join(genPath, entry.name)
        pastGenerationFile.displayName = entry.name.replace('.json', '')
        return pastGenerationFile
      })
    return onlyFilesDesc
  }
}
