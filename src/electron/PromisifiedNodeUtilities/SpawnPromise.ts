import { spawn } from 'child_process'

export const spawnPromise = (
  cmd: string,
  args: string[],
  cwd: string,
  shell?: boolean
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      //  console.log('spawnPromise', cmd, args, cwd, shell)
      const runCommand = spawn(cmd, args, { cwd, shell, timeout: 10000 })
      runCommand.stdout.on('data', data => resolve(data?.toString() || ''))
      runCommand.on('exit', code => {
        console.log('spawnPromise exit', code)
        if (code !== 0) {
          reject(new Error(`Command failed with code ${code}`))
        }
        resolve('')
      })
      runCommand.on('error', err => {
        console.log('spawn error', err)
        throw new Error(err.message)
      })
    } catch (e) {
      reject(e)
    }
  })
}
