import path from 'node:path'
import fs from 'node:fs/promises'
import os from 'node:os'
import { spawn } from 'node:child_process'

const fileRegex = /\.(elm)$/

export default function myPlugin() {
  let server
  return {
    name: 'elm-land',
    configureServer(server_) { server = server_ },
    async load(filepath) {
      if (fileRegex.test(filepath)) {
        server.watcher.unwatch(filepath)
        return compileTheCurrentFile(filepath)
      }
    }
  }
}

// Used during development
const compileTheCurrentFile = async (filepath) => {
  let outputFilepath = await elmWatchHot({ filepath })

  let contents = await fs.readFile(outputFilepath, { encoding: 'utf-8' })
  return `export default ({ run () { ${contents} window.Elm = this.Elm; return window.Elm } }).run()`
}

let elmWatchHot = async ({ filepath }) => {
  let temp = path.join(os.tmpdir())

  let elmWatchJsonFilepath = path.join(temp, 'elm-watch.json')
  let outputFilepath = path.join(temp, 'dist', 'out.js')

  let elmWatchJson = {
    targets: {
      Main: {
        inputs: [filepath],
        output: outputFilepath
      }
    }
  }

  await fs.writeFile(
    elmWatchJsonFilepath,
    JSON.stringify(elmWatchJson),
    { encoding: 'utf-8' }
  )

  let elmWatch = spawn('elm-watch', ['hot'], { cwd: temp })

  elmWatch.on('error', (err) => console.error(err))

  return outputFilepath
}