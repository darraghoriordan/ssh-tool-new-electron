import { exec } from 'child_process'

export const execPromise = (
  cmd: string,
  cwd: string,
  shell?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      //  console.log('spawnPromise', cmd, args, cwd, shell)
      const runCommand = exec(
        cmd,
        { cwd, shell, timeout: 10000 },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`)
            reject(new Error(`Command failed with code ${error}`))
            return
          }
          console.log(`stdout: ${stdout}`)
          console.error(`stderr: ${stderr}`)
          resolve(stdout)
        }
      )
    } catch (e) {
      reject(e)
    }
  })
}
