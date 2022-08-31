import { spawn } from 'child_process'

export const spawnPromise = (
  cmd: string,
  args: string[],
  cwd: string,
  shell?: boolean
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const runCommand = spawn(cmd, args, { cwd, shell })
      runCommand.stdout.on('data', data => resolve(data.toString()))
      runCommand.on('error', err => {
        throw new Error(err.message)
      })
    } catch (e) {
      reject(e)
    }
  })
}
